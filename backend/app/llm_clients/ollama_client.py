import aiohttp
from .base import clean_ai_response

class OllamaClient:
    def __init__(self, base_url: str, model: str = "llama3"):
        self.base_url = base_url.rstrip('/')
        self.model = model
        self.url = f"{self.base_url}/api/generate"

    async def get_completion(self, session: aiohttp.ClientSession, prompt: str) -> str:
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        
        async with session.post(self.url, json=payload) as response:
            if response.status != 200:
                text = await response.text()
                raise Exception(f"Ollama API Error {response.status}: {text}")
            data = await response.json()
            res = data.get("response", "")
            return clean_ai_response(res)
