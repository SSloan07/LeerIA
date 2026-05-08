from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pathlib import Path
from uuid import UUID, uuid4
import shutil
import os

from app.database.database_call import supabase
from app.models.entities import DocumentCreate
from app.core.config import SUPABASE_BUCKET
from app.api.v1.documentsUtils.document_auxiliary import clean_filename


router = APIRouter()


@router.post("/")
def create_document(document: DocumentCreate):
    data = document.model_dump(mode="json")

    try:
        subject_response = (
            supabase
            .table("subjects")
            .select("*")
            .eq("id", data["subject_id"])
            .execute()
        )

        if not subject_response.data:
            raise HTTPException(
                status_code=404,
                detail="La materia asociada no existe"
            )

        response = (
            supabase
            .table("documents")
            .insert(data)
            .execute()
        )

        return {
            "message": "Documento creado correctamente",
            "data": response.data[0]
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Al crear documento. Error: {str(error)}"
        )





BASE_DIR = Path(__file__).resolve().parents[3]
UPLOAD_DIR = BASE_DIR / "storage" / "uploads"

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".pptx", ".txt"}


@router.post("/upload")
async def upload_document(
    subject_id: str = Form(...),
    file: UploadFile = File(...)
):
    bucket_name = os.getenv("SUPABASE_BUCKET", "documents")

    if not file.filename:
        raise HTTPException(status_code=400, detail="El archivo no tiene nombre")

    safe_filename = clean_filename(file.filename)

    storage_path = f"subjects/{subject_id}/{safe_filename}"

    file_bytes = await file.read()

    if not file_bytes:
        raise HTTPException(status_code=400, detail="El archivo está vacío")

    try:
        upload_response = supabase.storage.from_(bucket_name).upload(
            path=storage_path,
            file=file_bytes,
            file_options={
                "content-type": file.content_type or "application/octet-stream",
                "upsert": "false"
            }
        )

        document_data = {
            "subject_id": subject_id,
            "file_name": safe_filename,
            "storage_path": storage_path,
            "status": "uploaded"
        }

        db_response = supabase.table("documents").insert(document_data).execute()

        return {
            "message": "Archivo subido correctamente",
            "bucket": bucket_name,
            "storage_path": storage_path,
            "document": db_response.data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error subiendo archivo a Supabase: {str(e)}"
        )