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
    if not new_chat:
        raise HTTPException(status_code=500, detail="Failed to create and retrieve chat.")
    # CORRECTED: Convert ObjectId to str before validation
    return ChatInDB.model_validate({**new_chat, "_id": str(new_chat["_id"])})

@router.get("/api/chats", response_model=List[ChatInfo])
async def get_all_chats(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    chats = chats_collection.find({"user_id": user_id}, {"_id": 1, "title": 1, "lastActivityTimestamp": 1})
    # CORRECTED: Convert ObjectId to str for each document
    return [ChatInfo.model_validate({**chat, "_id": str(chat["_id"])}) for chat in chats]

@router.get("/api/chats/{chat_id}", response_model=ChatInDB)
async def get_chat(chat_id: str, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    if not ObjectId.is_valid(chat_id):
        raise HTTPException(status_code=400, detail="Invalid chat ID")
        
    chat = chats_collection.find_one({"_id": ObjectId(chat_id), "user_id": user_id})
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    # CORRECTED: Convert ObjectId to str before validation
    return ChatInDB.model_validate({**chat, "_id": str(chat["_id"])})

@router.post("/api/chats/{chat_id}/messages", response_model=ChatInDB)
async def add_message(chat_id: str, message: Message, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    if not ObjectId.is_valid(chat_id):
        raise HTTPException(status_code=400, detail="Invalid chat ID")
        
    update_result = chats_collection.update_one(
        {"_id": ObjectId(chat_id), "user_id": user_id},
        {
            "$push": {"messages": message.model_dump()},
            "$set": {"lastActivityTimestamp": datetime.utcnow()}
        }
    )
    if update_result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Chat not found")
        
    updated_chat = chats_collection.find_one({"_id": ObjectId(chat_id)})
    if not updated_chat:
        raise HTTPException(status_code=404, detail="Chat not found after update.")
    # CORRECTED: Convert ObjectId to str before validation
    return ChatInDB.model_validate({**updated_chat, "_id": str(updated_chat["_id"])})

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
    if not updated_chat:
        raise HTTPException(status_code=404, detail="Chat not found after update.")
    # CORRECTED: Convert ObjectId to str before validation
    return ChatInDB.model_validate({**updated_chat, "_id": str(updated_chat["_id"])})

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
