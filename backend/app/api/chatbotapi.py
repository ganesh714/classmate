from fastapi import APIRouter, Query, UploadFile, File, Form
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from google import genai
import markdown2
import io
import PyPDF2
from docx import Document
import tempfile

# Load environment variables
load_dotenv()

# Setup Gemini Clients with two API keys
api_key1 = os.getenv("GEMINI_API_KEY1")
api_key2 = os.getenv("GEMINI_API_KEY2")

# Use a simple try-except block to handle potential initialization errors gracefully
try:
    client1 = genai.Client(api_key=api_key1)
except Exception as e:
    print(f"Warning: Could not initialize Gemini client1. Error: {e}")
    client1 = None

try:
    client2 = genai.Client(api_key=api_key2)
except Exception as e:
    print(f"Warning: Could not initialize Gemini client2. Error: {e}")
    client2 = None


router = APIRouter()

class ChatRequest(BaseModel):
    prompt: str

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_file = io.BytesIO(file_content)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return ""

def extract_text_from_docx(file_content: bytes) -> str:
    """Extract text from DOCX file"""
    try:
        doc_file = io.BytesIO(file_content)
        doc = Document(doc_file)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        print(f"Error extracting DOCX text: {e}")
        return ""

def extract_text_from_txt(file_content: bytes) -> str:
    """Extract text from TXT file"""
    try:
        return file_content.decode('utf-8')
    except UnicodeDecodeError:
        try:
            return file_content.decode('latin-1')
        except Exception as e:
            print(f"Error extracting TXT text: {e}")
            return ""

async def generate_reply(prompt: str, client):
    if not client:
        raise Exception("Gemini client not initialized.")
    response = client.models.generate_content(
        model="gemini-2.5-flash", # Assuming this is the correct model name
        contents=prompt
    )
    return response.text

@router.post("/api/chat-with-file")
async def chat_with_file(
    file: UploadFile = File(...),
    prompt: str = Form(...),
    as_markdown: bool = Query(False)
):
    try:
        # Check file type and extract text
        file_content = await file.read()
        filename = file.filename.lower()
        
        extracted_text = ""
        
        if filename.endswith('.pdf'):
            extracted_text = extract_text_from_pdf(file_content)
        elif filename.endswith('.docx'):
            extracted_text = extract_text_from_docx(file_content)
        elif filename.endswith('.txt'):
            extracted_text = extract_text_from_txt(file_content)
        else:
            return {"reply": "Unsupported file format. Please upload PDF, DOCX, or TXT files."}
        
        if not extracted_text.strip():
            return {"reply": "Could not extract text from the uploaded file. Please ensure the file contains readable text."}
        
        # Combine extracted text with user prompt
        full_prompt = f"""Based on the following document content, please answer the user's question:

Document Content:
{extracted_text[:10000]}  # Limit to first 10k characters to avoid token limits

User Question: {prompt}

Please provide a helpful response based on the document content."""

        reply_text = ""
        # First try with client1
        try:
            if client1:
                reply_text = await generate_reply(full_prompt, client1)
            else:
                raise Exception("Client1 not available")
        except Exception as e1:
            # If error (e.g., 503, client unavailable), switch to client2
            print(f"Client1 failed with error: {e1}. Switching to Client2.")
            try:
                if client2:
                    reply_text = await generate_reply(full_prompt, client2)
                else:
                     raise Exception("Client2 not available")
            except Exception as e2:
                print(f"Client2 also failed with error: {e2}.")
                return {"reply": "Service is temporarily busy. Please try again later."}

        if as_markdown:
            reply_text = markdown2.markdown(reply_text)
        return {"reply": reply_text}
    except Exception as e:
        return {"reply": f"An error occurred while processing the file: {str(e)}"}

@router.post("/api/chat")
async def chat(req: ChatRequest, as_markdown: bool = Query(False)):
    try:
        reply_text = ""
        # First try with client1
        try:
            if client1:
                reply_text = await generate_reply(req.prompt, client1)
            else:
                raise Exception("Client1 not available")
        except Exception as e1:
            # If error (e.g., 503, client unavailable), switch to client2
            print(f"Client1 failed with error: {e1}. Switching to Client2.")
            try:
                if client2:
                    reply_text = await generate_reply(req.prompt, client2)
                else:
                     raise Exception("Client2 not available")
            except Exception as e2:
                print(f"Client2 also failed with error: {e2}.")
                return {"reply": "Service is temporarily busy. Please try again later."}

        if as_markdown:
            reply_text = markdown2.markdown(reply_text)
        return {"reply": reply_text}
    except Exception as e:
        return {"reply": f"An unexpected error occurred: {str(e)}"}
