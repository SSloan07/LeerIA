from fastapi import APIRouter

from app.api.v1.health import router as health_router
from app.api.v1 import subjects
from app.api.v1 import documents
from app.api.v1.chat import rag
from app.api.v1 import conversations
from app.api.v1 import generated_items

api_router = APIRouter(prefix="/api/v1")



# Rutas de subject
api_router.include_router( subjects.router, prefix="/subjects", tags=["Subjects"])

# Rutas de document 
api_router.include_router( documents.router, prefix="/documents", tags=["Documents"])

# Rutas de chat 
api_router.include_router( rag.router, prefix="/chat", tags=["Chat"])

# Rutas de conversaciones 
api_router.include_router(conversations.router, prefix="/conversations", tags=["Conversations"])

# Rutas para los items generados (Estos son los de material de estudio diferenciado) 
api_router.include_router( generated_items.router, prefix="/generated-items", tags=["Generated Items"])

api_router.include_router(health_router)
