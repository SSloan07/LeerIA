from uuid import UUID

from fastapi import APIRouter
from app.models.entities import UserMessageCreate, ConversationCreate

from app.services.conversation_service import (
    create_conversation_service,
    get_conversation_service,
    get_conversations_by_subject_service,
    get_recent_messages_service,
)

from app.services.conversation_rag_service import (
    send_conversation_message_service,
)


router = APIRouter()



@router.post("/")
def create_conversation(conversation: ConversationCreate):
    return create_conversation_service(
        subject_id=conversation.subject_id,
        title=conversation.title,
    )


@router.get("/subject/{subject_id}")
def get_conversations_by_subject(subject_id: UUID):
    return get_conversations_by_subject_service(subject_id)


@router.get("/{conversation_id}")
def get_conversation(conversation_id: UUID):
    return get_conversation_service(conversation_id)


@router.get("/{conversation_id}/messages")
def get_conversation_messages(conversation_id: UUID):
    get_conversation_service(conversation_id)

    return get_recent_messages_service(
        conversation_id=conversation_id,
        limit=50,
    )


@router.post("/{conversation_id}/chat")
def send_conversation_message(
    conversation_id: UUID,
    message: UserMessageCreate,
):
    return send_conversation_message_service(
        conversation_id=conversation_id,
        content=message.content,
    )