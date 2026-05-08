from fastapi import APIRouter

from app.api.v1.health import router as health_router
from app.api.v1 import subjects
from app.api.v1 import documents

api_router = APIRouter(prefix="/api/v1")



# Rutas de subject
api_router.include_router( subjects.router, prefix="/subjects", tags=["Subjects"])

# Rutas de document 
api_router.include_router( documents.router, prefix="/documents", tags=["Documents"])

api_router.include_router(health_router)
