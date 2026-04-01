import os
import aiohttp
from dotenv import load_dotenv
from .gemini_client import GeminiClient
from .groq_client import GroqClient
from .ollama_client import OllamaClient

load_dotenv()

# Configuration
LLM_MODE = os.getenv("LLM_MODE", "online").lower() # 'online' or 'offline'
GEMINI_API_KEY1 = os.getenv("GEMINI_API_KEY1")
GEMINI_API_KEY2 = os.getenv("GEMINI_API_KEY2")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")

async def get_ai_response(prompt: str, preferred_model: str = "classmate") -> str:
    # 30 second timeout for the global session
    timeout = aiohttp.ClientTimeout(total=30)
    
    async with aiohttp.ClientSession(timeout=timeout) as session:
        # --- CLASSMATE: STRICTLY OFFLINE (Ollama) ---
        if preferred_model == "classmate":
            print("🎓 Routing to Classmate (Strictly Offline - Ollama)")
            try:
                client = OllamaClient(base_url=OLLAMA_BASE_URL, model="classmate")
                response = await client.get_completion(session, prompt)
                print(f"✅ Success: Generated response using Classmate (Ollama model: classmate)")
                return response
            except Exception as e:
                print(f"❌ Classmate (Ollama) failed: {e}")
                raise Exception("Classmate (Offline) is currently unavailable. Please make sure Ollama is running.")

        # --- LLAMA: GROQ CLOUD (70B) ---
        elif preferred_model == "llama":
            print("🦙 Routing to Llama (Groq Cloud)")
            if GROQ_API_KEY:
                try:
                    model_name = "llama-3.3-70b-versatile"
                    groq = GroqClient(api_key=GROQ_API_KEY, model=model_name)
                    response = await groq.get_completion(session, prompt)
                    print(f"✅ Success: Generated response using Llama (Groq model: {model_name})")
                    return response
                except Exception as e:
                    print(f"❌ Llama (Groq) failed: {e}")
                    raise e
            else:
                raise Exception("Groq API key is missing. Please configure it to use Llama.")

        # --- GEMINI: GOOGLE CLOUD ---
        elif preferred_model == "gemini":
            print("♊ Routing to Gemini (Google Cloud)")
            gemini_keys = [GEMINI_API_KEY1, GEMINI_API_KEY2]
            if any(gemini_keys):
                try:
                    gemini = GeminiClient(api_keys=gemini_keys)
                    response = await gemini.get_completion(session, prompt)
                    print(f"✅ Success: Generated response using Gemini (Model: {gemini.model})")
                    return response
                except Exception as e:
                    print(f"⚠️ Gemini failed: {e}. Trying Groq fallback...")
            
            # Deep fallback to Groq if Gemini fails
            if GROQ_API_KEY:
                try:
                    groq = GroqClient(api_key=GROQ_API_KEY)
                    response = await groq.get_completion(session, prompt)
                    print(f"✅ Success: Generated response using Groq Fallback (Model: {groq.model})")
                    return response
                except Exception as ex:
                    print(f"❌ All cloud failovers failed: {ex}")
                    raise e
            else:
                raise Exception("Gemini failed and no Groq key configured.")

        # Default fallback
        raise Exception(f"Unknown or unavailable model: {preferred_model}")
