# app/api/chathistoryapi.py
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

from .userapi import get_current_user, db

router = APIRouter()
chats_collection = db["chats"]

class Message(BaseModel):
    sender: str
    content: str

class ChatInDB(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    title: str
    messages: List[Message] = []
    lastActivityTimestamp: datetime

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str, datetime: lambda dt: dt.isoformat()}
        from_attributes = True

class ChatInfo(BaseModel):
    id: str = Field(alias="_id")
    title: str
    lastActivityTimestamp: datetime

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str, datetime: lambda dt: dt.isoformat()}
        from_attributes = True

class ChatTitleUpdate(BaseModel):
    title: str

def _validate_and_convert(chat_doc):
    """Helper to ensure a doc is found and its _id is converted to a string."""
    if not chat_doc:
        return None
    chat_doc["_id"] = str(chat_doc["_id"])
    return chat_doc

@router.post("/api/chats", response_model=ChatInDB, status_code=status.HTTP_201_CREATED)
async def create_chat(current_user: dict = Depends(get_current_user)):
    chat_data = {
        "user_id": str(current_user["_id"]),
        "title": "New Chat",
        "messages": [],
        "lastActivityTimestamp": datetime.utcnow()
    }
    result = chats_collection.insert_one(chat_data)
    new_chat = chats_collection.find_one({"_id": result.inserted_id})
    
    validated_chat = _validate_and_convert(new_chat)
    if not validated_chat:
        raise HTTPException(status_code=500, detail="Failed to create and retrieve chat.")
    return ChatInDB.model_validate(validated_chat)

@router.get("/api/chats", response_model=List[ChatInfo])
async def get_all_chats(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    chats = chats_collection.find({"user_id": user_id}, {"_id": 1, "title": 1, "lastActivityTimestamp": 1})
    return [ChatInfo.model_validate(_validate_and_convert(chat)) for chat in chats]

@router.get("/api/chats/{chat_id}", response_model=ChatInDB)
async def get_chat(chat_id: str, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    if not ObjectId.is_valid(chat_id):
        raise HTTPException(status_code=400, detail="Invalid chat ID")
        
    chat = chats_collection.find_one({"_id": ObjectId(chat_id), "user_id": user_id})
    validated_chat = _validate_and_convert(chat)
    if not validated_chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return ChatInDB.model_validate(validated_chat)

@router.post("/api/chats/{chat_id}/messages", response_model=ChatInDB)
async def add_message(chat_id: str, message: Message, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    if not ObjectId.is_valid(chat_id):
        raise HTTPException(status_code=400, detail="Invalid chat ID")
        
    update_result = chats_collection.update_one(
        {"_id": ObjectId(chat_id), "user_id": user_id},
        {"$push": {"messages": message.model_dump()}, "$set": {"lastActivityTimestamp": datetime.utcnow()}}
    )
    if update_result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Chat not found")
        
    updated_chat = chats_collection.find_one({"_id": ObjectId(chat_id)})
    validated_chat = _validate_and_convert(updated_chat)
    if not validated_chat:
        raise HTTPException(status_code=404, detail="Chat not found after update.")
    return ChatInDB.model_validate(validated_chat)

@router.put("/api/chats/{chat_id}", response_model=ChatInDB)
async def update_chat_title(chat_id: str, title_update: ChatTitleUpdate, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    if not ObjectId.is_valid(chat_id):
        raise HTTPException(status_code=400, detail="Invalid chat ID")
    
    update_result = chats_collection.update_one(
        {"_id": ObjectId(chat_id), "user_id": user_id},
        {"$set": {"title": title_update.title, "lastActivityTimestamp": datetime.utcnow()}}
    )
    if update_result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Chat not found")

    updated_chat = chats_collection.find_one({"_id": ObjectId(chat_id)})
    validated_chat = _validate_and_convert(updated_chat)
    if not validated_chat:
        raise HTTPException(status_code=404, detail="Chat not found after update.")
    return ChatInDB.model_validate(validated_chat)

@router.delete("/api/chats/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chat(chat_id: str, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    if not ObjectId.is_valid(chat_id):
        raise HTTPException(status_code=400, detail="Invalid chat ID")
        
    delete_result = chats_collection.delete_one({"_id": ObjectId(chat_id), "user_id": user_id})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Chat not found")
    return

@router.delete("/api/chats", status_code=status.HTTP_204_NO_CONTENT)
async def delete_all_chats(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    chats_collection.delete_many({"user_id": user_id})
    return
