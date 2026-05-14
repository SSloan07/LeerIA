from pydantic import BaseModel
from uuid import UUID # Esto es para las claves foraneas 
from typing import Any, Optional, Literal, Dict 





class SubjectCreate(BaseModel): 
    name: str 
    description: str | None = None 

class SubjectUpdate(BaseModel): 
    name: str | None = None
    description: str | None = None

class MessageCreate(BaseModel): 
    role: Literal["user", "assistant", "system"]
    content: str 
    conversation_id : UUID



class DocumentCreate(BaseModel): 
    subject_id: UUID 
    file_name: str
    file_type: str | None = None
    storage_path: str
    status: Literal["uploaded", "processing", "ready", "failed"] = "uploaded"

class DocumentChunkCreate(BaseModel): 
    document_id: UUID 
    subject_id: UUID 
    chunk_index: int
    content: str
    embedding: list[float] | None = None # Si uno se pone a mirar, realmente un embedding es una lista de flotantes. Por ejemplo -> [123.1341,13131.12,12354.123..]
    metadata: dict[str, Any] | None = None 

class ConversationCreate(BaseModel): 
    subject_id: UUID
    title: Optional[str] = "Nueva Conversación"


class ConversationUpdate(BaseModel):
    title: Optional[str] = None


class UserMessageCreate(BaseModel):
    content: str


GeneratedItemType = Literal[
    "summary",
    "quiz",
    "flashcards",
    "video_script",
]

class GeneratedItemGenerateRequest(BaseModel):
    subject_id: UUID
    conversation_id: UUID
    type: GeneratedItemType
    document_id: UUID | None = None
    force: bool = False
    match_count: int = 12


class GeneratedItemResponse(BaseModel):
    id: UUID
    conversation_id: UUID
    subject_id: UUID
    document_id: UUID | None = None
    type: GeneratedItemType
    content: dict[str, Any]
    metadata: dict[str, Any] | None = None





