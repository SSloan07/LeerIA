from openai import OpenAI

from app.core.config import OPENAI_API_KEY
from app.services.retrieval_service import (
    retrieve_relevant_chunks,
    build_context_from_chunks,
)


CHAT_MODEL = "gpt-4.1-mini"

client = OpenAI(api_key=OPENAI_API_KEY)


def build_rag_system_prompt() -> str:
    return (
        "Eres un asistente académico especializado en responder preguntas "
        "usando únicamente el contexto proporcionado.\n\n"
        "Reglas:\n"
        "1. Responde solo con base en el contexto.\n"
        "2. Si el contexto no contiene la respuesta, dilo claramente.\n"
        "3. No inventes información.\n"
        "4. Responde en español.\n"
        "5. Sé claro, breve y útil para estudiar."
    )


def build_rag_user_prompt(question: str, context: str) -> str:
    return f"""
    Contexto recuperado:
    {context}

    Pregunta del usuario:
    {question}

    Respuesta:
    """.strip()


def generate_rag_answer(
    subject_id: str,
    question: str,
    match_count: int = 5,
) -> dict:
    if not subject_id:
        raise ValueError("subject_id no puede estar vacío")

    if not question or not question.strip():
        raise ValueError("La pregunta no puede estar vacía")

    chunks = retrieve_relevant_chunks(
        subject_id=subject_id,
        question=question,
        match_count=match_count,
    )

    if not chunks:
        return {
            "answer": (
                "No encontré información suficiente en los documentos de esta "
                "materia para responder esa pregunta."
            ),
            "chunks": [],
            "context": "",
        }

    context = build_context_from_chunks(chunks)

    response = client.chat.completions.create(
        model=CHAT_MODEL,
        temperature=0,
        messages=[
            {
                "role": "system",
                "content": build_rag_system_prompt(),
            },
            {
                "role": "user",
                "content": build_rag_user_prompt(
                    question=question,
                    context=context,
                ),
            },
        ],
    )

    answer = response.choices[0].message.content

    return {
        "answer": answer,
        "chunks": chunks,
        "context": context,
    }


if __name__ == "__main__":
    subject_id = "d6a9dee6-169e-4861-9ffb-47d1ecdd38ba"
    question = "¿Qué materiales hay que cotizar?"

    result = generate_rag_answer(
        subject_id=subject_id,
        question=question,
        match_count=5,
    )

    print("Respuesta:")
    print(result["answer"])

    print("\nChunks usados:")
    for chunk in result["chunks"]:
        print(chunk["similarity"], chunk["metadata"])