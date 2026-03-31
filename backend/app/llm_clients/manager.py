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

async def get_ai_response(prompt: str) -> str:
    # 30 second timeout for the global session
    timeout = aiohttp.ClientTimeout(total=30)
    
    async with aiohttp.ClientSession(timeout=timeout) as session:
        if LLM_MODE == "offline":
            # --- OFFLINE MODE ---
            print("🤖 Routing to Offline Model (Ollama)")
            client = OllamaClient(base_url=OLLAMA_BASE_URL, model=OLLAMA_MODEL)
            return await client.get_completion(session, prompt)
            
        else:
            # --- ONLINE MODE (Failover Logic) ---
            print("🌐 Routing to Online Models (Gemini -> Groq)")
            
            # 1. Try Gemini First (handles multiple keys)
            gemini_keys = [GEMINI_API_KEY1, GEMINI_API_KEY2]
            if any(gemini_keys):
                try:
                    gemini = GeminiClient(api_keys=gemini_keys)
                    return await gemini.get_completion(session, prompt)
                except Exception as e:
                    print(f"⚠️ Gemini failed after trying all keys: {e}. Falling back to Groq...")
            else:
                 print("⚠️ Gemini keys missing, skipping to Groq...")

            # 2. Fallback to Groq
            if GROQ_API_KEY:
                try:
                    groq = GroqClient(api_key=GROQ_API_KEY)
                    return await groq.get_completion(session, prompt)
                except Exception as e:
                    print(f"❌ Groq also failed: {e}.")
                    raise Exception("All online AI providers are currently unavailable.")
            else:
                if not any(gemini_keys):
                    raise Exception("No online AI API keys configured (Gemini or Groq).")
                else:
                    raise Exception("Gemini failed and no Groq API key configured.")
