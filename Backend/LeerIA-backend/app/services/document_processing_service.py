from app.database.database_call import supabase
from app.services.storage_service import download_file_from_bucket
from app.services.text_extraction_service import extract_text_from_bytes
from app.services.chunking_service import split_text_into_chunks, TextChunk


def get_document_by_id(document_id: str) -> dict:
    response = (
        supabase
        .table("documents")
        .select("*")
        .eq("id", document_id)
        .execute()
    )

    if not response.data:
        raise ValueError("Documento no encontrado")

    return response.data[0]


def update_document_status(
    document_id: str,
    status: str,
) -> dict:
    response = (
        supabase
        .table("documents")
        .update({"status": status})
        .eq("id", document_id)
        .execute()
    )

    if not response.data:
        raise ValueError("No se pudo actualizar el estado del documento")

    return response.data[0]


def delete_existing_chunks(document_id: str) -> None:
    (
        supabase
        .table("document_chunks")
        .delete()
        .eq("document_id", document_id)
        .execute()
    )


def build_chunk_records(
    document: dict,
    chunks: list[TextChunk],
) -> list[dict]:
    document_id = document["id"]
    subject_id = document["subject_id"]
    file_name = document["file_name"]
    storage_path = document["storage_path"]

    records: list[dict] = []

    for chunk in chunks:
        records.append(
            {
                "document_id": document_id,
                "subject_id": subject_id,
                "chunk_index": chunk.chunk_index,
                "content": chunk.content,
                "embedding": None,
                "metadata": {
                    **chunk.metadata,
                    "file_name": file_name,
                    "storage_path": storage_path,
                },
            }
        )

    return records


def insert_document_chunks(chunk_records: list[dict]) -> list[dict]:
    if not chunk_records:
        return []

    response = (
        supabase
        .table("document_chunks")
        .insert(chunk_records)
        .execute()
    )

    if not response.data:
        raise ValueError("No se pudieron insertar los chunks del documento")

    return response.data


def process_document_pipeline(document_id: str) -> dict:
    document = get_document_by_id(document_id)

    try:
        update_document_status(document_id, "processing")

        storage_path = document["storage_path"]
        file_name = document["file_name"]

        file_bytes = download_file_from_bucket(storage_path)

        extracted_text = extract_text_from_bytes(
            file_bytes=file_bytes,
            file_name=file_name,
        )

        if not extracted_text.strip():
            update_document_status(document_id, "failed")
            raise ValueError("No se pudo extraer texto del documento")

        chunks = split_text_into_chunks(
            text=extracted_text,
            chunk_size=1000,
            overlap=150,
        )

        if not chunks:
            update_document_status(document_id, "failed")
            raise ValueError("No se generaron chunks para el documento")

        delete_existing_chunks(document_id)

        chunk_records = build_chunk_records(
            document=document,
            chunks=chunks,
        )

        inserted_chunks = insert_document_chunks(chunk_records)

        updated_document = update_document_status(document_id, "ready")

        return {
            "document": updated_document,
            "chunks_created": len(inserted_chunks),
            "status": "ready",
        }

    except Exception as error:
        update_document_status(document_id, "failed")
        raise error