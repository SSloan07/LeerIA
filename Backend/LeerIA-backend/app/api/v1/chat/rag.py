from uuid import UUID

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.rag_service import generate_rag_answer


router = APIRouter()


class RagChatRequest(BaseModel):
    subject_id: UUID
    question: str = Field(min_length=1)
    match_count: int = 5


@router.post("/rag")
def chat_with_rag(request: RagChatRequest):
    try:
        result = generate_rag_answer(
            subject_id=str(request.subject_id),
            question=request.question,
            match_count=request.match_count,
        )

        return {
            "message": "Respuesta generada correctamente",
            "data": {
                "answer": result["answer"],
                "sources": result["chunks"],
            },
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Error generando respuesta RAG: {str(error)}",
        )