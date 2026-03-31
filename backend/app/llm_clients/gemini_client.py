import aiohttp
import asyncio
from .base import clean_ai_response

class GeminiClient:
    def __init__(self, api_keys: list[str], model: str = "gemini-2.5-flash"):
        # We can handle multiple keys for failover/quota management
        self.api_keys = [key for key in api_keys if key]
        self.model = model

    def get_url(self, api_key: str) -> str:
        return f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={api_key}"

    async def get_completion(self, session: aiohttp.ClientSession, prompt: str) -> str:
        if not self.api_keys:
            raise Exception("No Gemini API keys provided.")

        last_error = None
        for i, api_key in enumerate(self.api_keys):
            try:
                url = self.get_url(api_key)
                headers = {"Content-Type": "application/json"}
                payload = {"contents": [{"parts": [{"text": prompt}]}]}
                
                async with session.post(url, headers=headers, json=payload) as response:
                    if response.status != 200:
                        text = await response.text()
                        raise Exception(f"Gemini API (Key {i+1}) Error {response.status}: {text}")
                    
                    data = await response.json()
                    # Check for candidates, parts, and text
                    if "candidates" in data and data["candidates"] and "content" in data["candidates"][0]:
                        res = data["candidates"][0]["content"]["parts"][0]["text"]
                        return clean_ai_response(res)
                    else:
                         raise Exception(f"Unexpected Gemini response format (Key {i+1}): {data}")
            except Exception as e:
                print(f"⚠️ Gemini Key {i+1} failed: {e}")
                last_error = e
                # If there are more keys, continue to next iteration
                continue
        
        # If we reached here, all keys failed
        raise last_error or Exception("All Gemini API keys failed.")
