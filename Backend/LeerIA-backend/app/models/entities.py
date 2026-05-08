from pydantic import BaseModel
from uuid import UUID # Esto es para las claves foraneas 
from typing import Any
from typing import Literal




class SubjectCreate(BaseModel): 
    name: str 
    description: str | None = None 

class SubjectUpdate(BaseModel): 
    name: str | None = None
    description: str | None = None

class MessageCreate(BaseModel): 
    role: Literal["user","model"]
    content: str 
    conversation_id : UUID 

class GeneratedItemsCreate(BaseModel): 
    subject_id: UUID 
    document_id: UUID | None = None
    type: Literal["summary", "quiz", "flashcards", "video_script"]
    content: dict[str, Any] 

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
    title: str = "Nueva Conversación"


