from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException

from app.core.supabase_client import supabase


def create_conversation_service(
    subject_id: UUID,
    title: str = "Nueva conversación",
):
    response = (
        supabase
        .table("conversations")
        .insert({
            "subject_id": str(subject_id),
            "title": title,
        })
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=500,
            detail="No se pudo crear la conversación",
        )

    return response.data[0]


def get_conversation_service(conversation_id: UUID):
    response = (
        supabase
        .table("conversations")
        .select("*")
        .eq("id", str(conversation_id))
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Conversación no encontrada",
        )

    return response.data[0]


def get_conversations_by_subject_service(subject_id: UUID):
    response = (
        supabase
        .table("conversations")
        .select("*")
        .eq("subject_id", str(subject_id))
        .order("created_at", desc=True)
        .execute()
    )

    return response.data or []


def save_message_service(
    conversation_id: UUID,
    role: str,
    content: str,
    metadata: dict | None = None,
):
    response = (
        supabase
        .table("messages")
        .insert({
            "conversation_id": str(conversation_id),
            "role": role,
            "content": content,
            "metadata": metadata or {},
        })
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=500,
            detail="No se pudo guardar el mensaje",
        )

    return response.data[0]


def get_recent_messages_service(
    conversation_id: UUID,
    limit: int = 20,
):
    response = (
        supabase
        .table("messages")
        .select("*")
        .eq("conversation_id", str(conversation_id))
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )

    messages = response.data or []

    return list(reversed(messages))


def update_conversation_activity_service(conversation_id: UUID):
    # Solo funciona si ya agregaste updated_at a conversations.
    supabase.table("conversations").update({
        "updated_at": datetime.now(timezone.utc).isoformat()
    }).eq("id", str(conversation_id)).execute()