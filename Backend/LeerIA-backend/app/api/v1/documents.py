from uuid import UUID

from fastapi import APIRouter, HTTPException, UploadFile, File, Form

from app.database.database_call import supabase
from app.models.entities import DocumentCreate
from app.core.config import SUPABASE_BUCKET
from app.services.document_service import (
    build_storage_path,
    clean_filename,
    is_allowed_file,
    get_file_extension,
)


router = APIRouter()


def validate_subject_exists(subject_id: str):
    subject_response = (
        supabase
        .table("subjects")
        .select("*")
        .eq("id", subject_id)
        .execute()
    )

    if not subject_response.data:
        raise HTTPException(
            status_code=404,
            detail="La materia asociada no existe"
        )


def insert_document_record(document_data: dict):
    response = (
        supabase
        .table("documents")
        .insert(document_data)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=500,
            detail="No se pudo crear el registro del documento"
        )

    return response.data[0]


@router.post("/")
def create_document(document: DocumentCreate):
    data = document.model_dump(mode="json")

    try:
        validate_subject_exists(data["subject_id"])

        created_document = insert_document_record(data)

        return {
            "message": "Documento creado correctamente",
            "data": created_document
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Al crear documento. Error: {str(error)}"
        )


@router.post("/upload")
async def upload_document(
    subject_id: UUID = Form(...),
    file: UploadFile = File(...)
):
    try:
        subject_id_str = str(subject_id)

        validate_subject_exists(subject_id_str)

        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="El archivo no tiene nombre"
            )

        if not is_allowed_file(file.filename):
            raise HTTPException(
                status_code=400,
                detail=f"Tipo de archivo no permitido: {get_file_extension(file.filename)}"
            )

        safe_filename = clean_filename(file.filename)
        storage_path = build_storage_path(subject_id_str, safe_filename)

        file_bytes = await file.read()

        if not file_bytes:
            raise HTTPException(
                status_code=400,
                detail="El archivo está vacío"
            )

        supabase.storage.from_(SUPABASE_BUCKET).upload(
            path=storage_path,
            file=file_bytes,
            file_options={
                "content-type": file.content_type or "application/octet-stream",
                "upsert": "false"
            }
        )

        document_data = {
            "subject_id": subject_id_str,
            "file_name": safe_filename,
            "file_type": file.content_type,
            "storage_path": storage_path,
            "status": "uploaded"
        }

        created_document = insert_document_record(document_data)

        return {
            "message": "Archivo subido correctamente",
            "bucket": SUPABASE_BUCKET,
            "storage_path": storage_path,
            "document": created_document
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Error subiendo archivo a Supabase: {str(error)}"
        )

    finally:
        await file.close()