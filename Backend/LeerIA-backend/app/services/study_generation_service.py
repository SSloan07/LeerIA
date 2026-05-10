import json
from uuid import UUID
from typing import Any

from fastapi import HTTPException

from app.core.openai_client import client, CHAT_MODEL
from app.core.supabase_client import supabase

from app.services.retrieval_service import (
    retrieve_relevant_chunks,
    build_context_from_chunks,
)


def build_generation_query(item_type: str) -> str:
    if item_type == "summary":
        return (
            "conceptos principales, estructura general, resumen, ideas clave, "
            "definiciones y conclusiones del documento"
        )

    if item_type == "quiz":
        return (
            "conceptos evaluables, definiciones, teoremas, propiedades, "
            "preguntas importantes y puntos clave para examen"
        )

    if item_type == "flashcards":
        return (
            "conceptos clave, definiciones breves, fórmulas, teoremas, "
            "preguntas y respuestas cortas para memorizar"
        )

    if item_type == "video_script":
        return (
            "explicación paso a paso, introducción, desarrollo, ejemplos y cierre "
            "para guion educativo"
        )

    raise ValueError("Tipo de generación no soportado")


def build_generation_prompt(item_type: str, context: str) -> str:
    base_rules = """
Eres LeerIA, un asistente académico que genera materiales de estudio usando únicamente el contexto documental proporcionado.

Reglas obligatorias:
1. Usa únicamente el contexto documental.
2. No inventes información.
3. Responde únicamente en JSON válido.
4. No uses Markdown.
5. No agregues texto fuera del JSON.
6. El contenido debe estar en español.
""".strip()

    if item_type == "summary":
        schema = """
Genera un JSON con esta estructura exacta:

{
  "title": "string",
  "overview": "string",
  "key_points": ["string"],
  "sections": [
    {
      "heading": "string",
      "body": "string"
    }
  ]
}
""".strip()

    elif item_type == "quiz":
        schema = """
Genera un JSON con esta estructura exacta:

{
  "title": "string",
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correct_answer": 0,
      "explanation": "string"
    }
  ]
}

Reglas específicas:
- Genera entre 5 y 8 preguntas.
- correct_answer debe ser el índice numérico de la opción correcta.
- El índice empieza en 0.
- Cada pregunta debe tener exactamente 4 opciones.
""".strip()

    elif item_type == "flashcards":
        schema = """
Genera un JSON con esta estructura exacta:

{
  "title": "string",
  "cards": [
    {
      "front": "string",
      "back": "string"
    }
  ]
}

Reglas específicas:
- Genera entre 8 y 12 flashcards.
- front debe ser una pregunta, concepto o término.
- back debe ser una respuesta clara y breve.
- Las tarjetas deben servir para estudiar activamente.
""".strip()

    elif item_type == "video_script":
        schema = """
Genera un JSON con esta estructura exacta:

{
  "title": "string",
  "hook": "string",
  "script": [
    {
      "section": "string",
      "narration": "string"
    }
  ],
  "closing": "string"
}
""".strip()

    else:
        raise ValueError("Tipo de generación no soportado")

    return f"""
{base_rules}

CONTEXTO DOCUMENTAL:
{context}

ESQUEMA DE SALIDA:
{schema}
""".strip()


def parse_llm_json(content: str) -> dict[str, Any]:
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        cleaned = (
            content
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=500,
                detail="El modelo no devolvió un JSON válido",
            )


def get_existing_generated_item(
    subject_id: UUID,
    item_type: str,
    document_id: UUID | None = None,
):
    query = (
        supabase
        .table("generated_items")
        .select("*")
        .eq("subject_id", str(subject_id))
        .eq("type", item_type)
        .order("created_at", desc=True)
        .limit(1)
    )

    if document_id:
        query = query.eq("document_id", str(document_id))

    response = query.execute()

    if response.data:
        return response.data[0]

    return None


def save_generated_item(
    subject_id: UUID,
    item_type: str,
    content: dict[str, Any],
    document_id: UUID | None = None,
    metadata: dict[str, Any] | None = None,
):
    data = {
        "subject_id": str(subject_id),
        "document_id": str(document_id) if document_id else None,
        "type": item_type,
        "content": content,
        "metadata": metadata or {},
        "status": "completed",
    }

    response = (
        supabase
        .table("generated_items")
        .insert(data)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=500,
            detail="No se pudo guardar el artefacto generado",
        )

    return response.data[0]


def generate_study_item_service(payload):
    subject_id = payload.subject_id
    item_type = payload.type
    document_id = payload.document_id
    force = payload.force
    match_count = payload.match_count

    if not force:
        existing_item = get_existing_generated_item(
            subject_id=subject_id,
            item_type=item_type,
            document_id=document_id,
        )

        if existing_item:
            return existing_item

    generation_query = build_generation_query(item_type)

    chunks = retrieve_relevant_chunks(
        subject_id=str(subject_id),
        question=generation_query,
        match_count=match_count,
    )

    if not chunks:
        raise HTTPException(
            status_code=404,
            detail="No encontré chunks suficientes para generar este material de estudio",
        )

    context = build_context_from_chunks(chunks)

    prompt = build_generation_prompt(
        item_type=item_type,
        context=context,
    )

    response = client.chat.completions.create(
        model=CHAT_MODEL,
        temperature=0,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "Eres un generador de materiales de estudio. "
                    "Debes responder únicamente con JSON válido."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
    )

    raw_content = response.choices[0].message.content

    if not raw_content:
        raise HTTPException(
            status_code=500,
            detail="El modelo no devolvió contenido",
        )

    generated_content = parse_llm_json(raw_content)

    metadata = {
        "model": CHAT_MODEL,
        "source": "subject_documents",
        "chunks_used": [chunk.get("id") for chunk in chunks],
        "similarities": [chunk.get("similarity") for chunk in chunks],
        "match_count": match_count,
    }

    return save_generated_item(
        subject_id=subject_id,
        item_type=item_type,
        document_id=document_id,
        content=generated_content,
        metadata=metadata,
    )


def get_generated_items_by_subject_service(
    subject_id: UUID,
    item_type: str | None = None,
):
    query = (
        supabase
        .table("generated_items")
        .select("*")
        .eq("subject_id", str(subject_id))
        .order("created_at", desc=True)
    )

    if item_type:
        query = query.eq("type", item_type)

    response = query.execute()

    return response.data or []


def get_generated_item_service(item_id: UUID):
    response = (
        supabase
        .table("generated_items")
        .select("*")
        .eq("id", str(item_id))
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Artefacto generado no encontrado",
        )

    return response.data[0]


def delete_generated_item_service(item_id: UUID):
    response = (
        supabase
        .table("generated_items")
        .delete()
        .eq("id", str(item_id))
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Artefacto generado no encontrado",
        )

    return response.data[0]