from uuid import UUID

from app.services.rag_service import generate_rag_answer
from app.services.conversation_service import (
    get_conversation_service,
    get_recent_messages_service,
    save_message_service,
    update_conversation_activity_service,
)


def build_chat_history_text(messages: list[dict]) -> str:
    lines = []

    for message in messages:
        role = message.get("role")
        content = message.get("content")

        if role == "user":
            lines.append(f"Usuario: {content}")
        elif role == "assistant":
            lines.append(f"LeerIA: {content}")

    return "\n".join(lines)


def build_retrieval_question(
    messages: list[dict],
    current_question: str,
) -> str:
    recent_messages = messages[-6:]
    history_text = build_chat_history_text(recent_messages)

    return f"""
Historial reciente:
{history_text}

Pregunta actual:
{current_question}
""".strip()


def send_conversation_message_service(
    conversation_id: UUID,
    content: str,
):
    conversation = get_conversation_service(conversation_id)
    subject_id = conversation["subject_id"]

    saved_user_message = save_message_service(
        conversation_id=conversation_id,
        role="user",
        content=content,
        metadata={},
    )

    messages = get_recent_messages_service(
        conversation_id=conversation_id,
        limit=20,
    )

    chat_history = build_chat_history_text(messages)

    retrieval_question = build_retrieval_question(
        messages=messages,
        current_question=content,
    )

    rag_result = generate_rag_answer(
        subject_id=subject_id,
        question=content,
        match_count=5,
        chat_history=chat_history,
        retrieval_question=retrieval_question,
    )

    chunks = rag_result.get("chunks", [])

    saved_assistant_message = save_message_service(
        conversation_id=conversation_id,
        role="assistant",
        content=rag_result["answer"],
        metadata={
            "used_rag": True,
            "subject_id": subject_id,
            "chunks_used": [
                chunk.get("id") for chunk in chunks
            ],
            "similarities": [
                chunk.get("similarity") for chunk in chunks
            ],
        },
    )

    update_conversation_activity_service(conversation_id)

    return {
        "user_message": saved_user_message,
        "assistant_message": saved_assistant_message,
        "chunks": chunks,
    }