from app.core.config import SUPABASE_BUCKET
from app.database.database_call import supabase


def upload_file_to_bucket(
    storage_path: str,
    file_bytes: bytes,
    content_type: str | None = None,
    upsert: bool = False,
):
    if not file_bytes:
        raise ValueError("El archivo está vacío")

    response = supabase.storage.from_(SUPABASE_BUCKET).upload(
        path=storage_path,
        file=file_bytes,
        file_options={
            "content-type": content_type or "application/octet-stream",
            "upsert": str(upsert).lower(),
        },
    )

    return response


def download_file_from_bucket(storage_path: str) -> bytes:
    if not storage_path:
        raise ValueError("storage_path no puede estar vacío")

    response = supabase.storage.from_(SUPABASE_BUCKET).download(storage_path)

    if not response:
        raise ValueError(f"No se pudo descargar el archivo: {storage_path}")

    return response


def delete_file_from_bucket(storage_path: str):
    if not storage_path:
        raise ValueError("storage_path no puede estar vacío")

    response = supabase.storage.from_(SUPABASE_BUCKET).remove([storage_path])

    return response


def get_public_url(storage_path: str) -> str:
    if not storage_path:
        raise ValueError("storage_path no puede estar vacío")

    response = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(storage_path)

    return response


def create_signed_url(storage_path: str, expires_in: int = 3600):
    if not storage_path:
        raise ValueError("storage_path no puede estar vacío")

    response = supabase.storage.from_(SUPABASE_BUCKET).create_signed_url(
        path=storage_path,
        expires_in=expires_in,
    )

    return response