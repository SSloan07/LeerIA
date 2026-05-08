from app.database.database_call import supabase
from app.services.embedding_service import generate_embedding


def retrieve_relevant_chunks(
    subject_id: str,
    question: str,
    match_count: int = 5,
) -> list[dict]:
    if not subject_id:
        raise ValueError("subject_id no puede estar vacío")

    if not question or not question.strip():
        raise ValueError("La pregunta no puede estar vacía")

    question_embedding = generate_embedding(question)

    response = (
        supabase
        .rpc(
            "match_document_chunks",
            {
                "query_embedding": question_embedding,
                "match_subject_id": subject_id,
                "match_count": match_count,
            }
        )
        .execute()
    )

    return response.data or []


def build_context_from_chunks(chunks: list[dict]) -> str:
    if not chunks:
        return ""

    context_parts: list[str] = []

    for index, chunk in enumerate(chunks, start=1):
        metadata = chunk.get("metadata") or {}
        file_name = metadata.get("file_name", "documento desconocido")

        context_parts.append(
            f"[Chunk {index} | Fuente: {file_name}]\n"
            f"{chunk['content']}"
        )

    return "\n\n".join(context_parts)

if __name__ == "__main__":
    subject_id = "d6a9dee6-169e-4861-9ffb-47d1ecdd38ba"
    question = "Que materiales hay que cotizar?"

    chunks = retrieve_relevant_chunks(
        subject_id=subject_id,
        question=question,
        match_count=5,
    )

    print("Chunks encontrados:", len(chunks))

    for chunk in chunks:
        print("Similarity:", chunk["similarity"])
        print(chunk["content"][:300])
        print("-" * 80)