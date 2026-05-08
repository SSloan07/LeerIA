from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pathlib import Path
from uuid import UUID
import shutil

from app.database.database_call import supabase
from app.models.entities import DocumentCreate


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
async def upload_document( subject_id: UUID = Form(...), file: UploadFile = File(...)):

    try:
       
        subject_response = (
            supabase
            .table("subjects")
            .select("*")
            .eq("id", str(subject_id))
            .execute()
        )

        if not subject_response.data:
            raise HTTPException(
                status_code=404,
                detail="La materia asociada no existe"
            )

        
        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="El archivo no tiene nombre"
            )

        file_extension = Path(file.filename).suffix.lower()

        if file_extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Tipo de archivo no permitido: {file_extension}"
            )

        
        subject_upload_dir = UPLOAD_DIR / str(subject_id)
        subject_upload_dir.mkdir(parents=True, exist_ok=True)

        
        file_path = subject_upload_dir / file.filename

        
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        
        document_data = {
            "subject_id": str(subject_id),
            "file_name": file.filename,
            "file_type": file.content_type,
            "storage_path": str(file_path),
            "status": "uploaded",
        }

        document_response = (
            supabase
            .table("documents")
            .insert(document_data)
            .execute()
        )

        return {
            "message": "Documento subido correctamente",
            "data": document_response.data[0]
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Error al subir documento: {str(error)}"
        )

    finally:
        await file.close()