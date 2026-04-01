import aiohttp
from .base import clean_ai_response, ServiceOverloadedException

class GroqClient:
    def __init__(self, api_key: str, model: str = "llama-3.3-70b-versatile"):
        self.api_key = api_key
        self.model = model
        self.url = "https://api.groq.com/openai/v1/chat/completions"

    async def get_completion(self, session: aiohttp.ClientSession, prompt: str) -> str:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}]
        }
        
        async with session.post(self.url, headers=headers, json=payload) as response:
            if response.status != 200:
                if response.status == 429:
                    raise ServiceOverloadedException("Groq")
                text = await response.text()
                raise Exception(f"Groq API Error {response.status}: {text}")
            data = await response.json()
            if "choices" in data and data["choices"]:
                res = data["choices"][0]["message"]["content"]
                return clean_ai_response(res)
            else:
                 raise Exception(f"Unexpected Groq response format: {data}")
