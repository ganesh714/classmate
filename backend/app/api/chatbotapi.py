from fastapi import APIRouter, Query
from pydantic import BaseModel
import markdown2
from app.llm_clients.manager import get_ai_response

router = APIRouter()

class ChatRequest(BaseModel):
    prompt: str

@router.post("/api/chat")
async def chat(req: ChatRequest, as_markdown: bool = Query(False)):
    try:
        # The manager handles online/offline routing and fallbacks automatically
        reply_text = await get_ai_response(req.prompt)

        if as_markdown:
            # Ensure we're converting the reply to markdown if requested
            reply_text = markdown2.markdown(reply_text)
            
        return {"reply": reply_text}
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return {"reply": f"An unexpected error occurred: {str(e)}"}

