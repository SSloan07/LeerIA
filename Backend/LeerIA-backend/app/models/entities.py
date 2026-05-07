from pydantic import BaseModel
from uuid import UUID # Esto es para las claves foraneas 

class SubjectCreate(BaseModel): 
    name: str 
    description: str | None = None 

class MessageCreate(BaseModel): 
    role: str 
    content: str 
    conversation_id : UUID 

class GeneratedItemsCreate(BaseModel): 
    subject_id: UUID 
    document_id: UUID 
    type: str 
    content: dict ## En supabase es un jsonB 

class DocumentCreate(BaseModel): 
    subject_id: UUID 
    file_name: str
    storage_path: str
    status: str 

class DocumentChunckCreate(BaseModel): 
    document_id: UUID 
    subject_id: UUID 
    chunck_index: int 
    content: str
    embedding: list[float] # Si uno se pone a mirar, realmente un embedding es una lista de flotantes. Por ejemplo -> [123.1341,13131.12,12354.123..]

class ConversationCreate(BaseModel): 
    subject_id: UUID
    title: str 
     

