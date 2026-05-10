from uuid import UUID
from typing import Optional

from fastapi import APIRouter, Query

from app.models.entities import (
    GeneratedItemGenerateRequest,
    GeneratedItemType,
)

from app.services.study_generation_service import (
    generate_study_item_service,
    get_generated_items_by_subject_service,
    get_generated_item_service,
    delete_generated_item_service,
)


router = APIRouter()


@router.post("/generate")
def generate_study_item(payload: GeneratedItemGenerateRequest):
    """
    Genera un artefacto de estudio:
    - summary
    - quiz
    - flashcards
    - video_script

    Guarda el resultado en generated_items y retorna el item generado.
    """
    return generate_study_item_service(payload)


@router.get("/subject/{subject_id}")
def get_generated_items_by_subject(
    subject_id: UUID,
    type: Optional[GeneratedItemType] = Query(default=None),
):
    """
    Lista los artefactos generados de una materia.
    Opcionalmente filtra por tipo.
    """
    return get_generated_items_by_subject_service(
        subject_id=subject_id,
        item_type=type,
    )


@router.get("/{item_id}")
def get_generated_item(item_id: UUID):
    """
    Obtiene un artefacto generado por ID.
    """
    return get_generated_item_service(item_id)


@router.delete("/{item_id}")
def delete_generated_item(item_id: UUID):
    """
    Elimina un artefacto generado.
    """
    deleted_item = delete_generated_item_service(item_id)

    return {
        "message": "Artefacto generado eliminado correctamente",
        "item": deleted_item,
    }