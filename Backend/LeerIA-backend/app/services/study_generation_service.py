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
7. Si incluyes fórmulas, variables matemáticas, funciones, intervalos, subíndices, superíndices, integrales, derivadas, vectores, operadores como gradiente, divergencia, rotacional o expresiones algebraicas, escríbelas en LaTeX.
8. Toda fórmula en línea debe ir obligatoriamente entre delimitadores \\( ... \\).
9. Toda fórmula larga debe ir obligatoriamente entre delimitadores \\[ ... \\].
10. Nunca escribas expresiones como f_{X,Y}(x,y), x^2, k(x+y), div(rot F), rot F, grad f, 0 ≤ x ≤ 1 o integrales fuera de delimitadores LaTeX.
11. Para operadores vectoriales usa notación LaTeX, por ejemplo: \\( \\nabla \\cdot (\\nabla \\times \\mathbf{F}) = 0 \\).
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
    - Si una pregunta, opción o explicación contiene fórmulas, símbolos matemáticos, integrales, derivadas, vectores, gradiente, divergencia, rotacional o productos punto/cruz, escríbelos siempre en LaTeX.
    - Toda fórmula en línea debe ir entre delimitadores \\( ... \\).
    - Toda fórmula larga debe ir entre delimitadores \\[ ... \\].
    - No escribas fórmulas como texto plano.
    - Ejemplo correcto: "\\( \\iint_S (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S} = \\oint_C \\mathbf{F} \\cdot d\\mathbf{r} \\)".
    - Ejemplo incorrecto: "∫∫_S (rot F) · dS = ∫_C F · dα".
    - Ejemplo correcto: "\\( \\iiint_V \\nabla \\cdot \\mathbf{F}\\, dV = \\iint_S \\mathbf{F} \\cdot \\mathbf{n}\\, dS \\)".
    - Ejemplo incorrecto: "∫∫∫_V div F dV = ∫∫_S F · n dS".
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
- Si una tarjeta contiene fórmulas, escríbelas siempre con delimitadores LaTeX.
- Ejemplo correcto: "La divergencia del rotacional cumple \\( \\nabla \\cdot (\\nabla \\times \\mathbf{F}) = 0 \\)".
- Ejemplo incorrecto: "La divergencia del rotacional cumple div(rot F) = 0".
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
    conversation_id: UUID,
    item_type: str,
    document_id: UUID | None = None,
):
    query = (
        supabase
        .table("generated_items")
        .select("*")
        .eq("subject_id", str(subject_id))
        .eq("conversation_id", str(conversation_id))
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
    conversation_id: UUID,
    item_type: str,
    content: dict[str, Any],
    document_id: UUID | None = None,
    metadata: dict[str, Any] | None = None,
):
    data = {
        "subject_id": str(subject_id),
        "conversation_id": str(conversation_id),
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
    conversation_id = payload.conversation_id
    item_type = payload.type
    document_id = payload.document_id
    force = payload.force
    match_count = payload.match_count

    if not force:
        existing_item = get_existing_generated_item(
            subject_id=subject_id,
            conversation_id=conversation_id,
            item_type=item_type,
            document_id=document_id,
        )

        if existing_item:
            return existing_item

    conversation_context = get_conversation_context(conversation_id)

    generation_query = build_contextual_generation_query(
        item_type=item_type,
        conversation_context=conversation_context,
    )

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
    # Esta fue una de las muchas cosas que tocó hacer porque mis compañeros no escucharon
    prompt = build_generation_prompt(
        item_type=item_type,
        context=f"""
    CONTEXTO RECIENTE DE LA CONVERSACIÓN:
    {conversation_context}

    FRAGMENTOS DOCUMENTALES RECUPERADOS:
    {context}
    """.strip(),
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
        "conversation_id": str(conversation_id),
        "chunks_used": [chunk.get("id") for chunk in chunks],
        "similarities": [chunk.get("similarity") for chunk in chunks],
        "match_count": match_count,
    }

    return save_generated_item(
        subject_id=subject_id,
        conversation_id=conversation_id,
        item_type=item_type,
        document_id=document_id,
        content=generated_content,
        metadata=metadata,
    )


def get_generated_items_by_subject_service(
    subject_id: UUID,
    conversation_id: UUID,
    item_type: str | None = None,
):
    query = (
        supabase
        .table("generated_items")
        .select("*")
        .eq("subject_id", str(subject_id))
        .eq("conversation_id", str(conversation_id))
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

def get_conversation_context(conversation_id: UUID, limit: int = 6) -> str:
    response = (
        supabase
        .table("messages")
        .select("role, content, created_at")
        .eq("conversation_id", str(conversation_id))
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )

    if not response.data:
        return ""

    messages = list(reversed(response.data))

    return "\n".join(
        f"{message['role']}: {message['content']}"
        for message in messages
        if message.get("content")
    )

def build_contextual_generation_query(
    item_type: str,
    conversation_context: str,
) -> str:
    base_query = build_generation_query(item_type)

    if not conversation_context:
        return base_query

    return f"""
{base_query}

Contexto reciente de la conversación:
{conversation_context}
""".strip()