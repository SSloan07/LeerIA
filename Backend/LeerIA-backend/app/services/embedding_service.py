from openai import OpenAI

from app.core.config import OPENAI_API_KEY


EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DIMENSIONS = 1536


client = OpenAI(api_key=OPENAI_API_KEY)


def clean_text_for_embedding(text: str) -> str:
    if not text:
        raise ValueError("El texto no puede estar vacío")

    cleaned_text = " ".join(text.split())

    if not cleaned_text:
        raise ValueError("El texto no puede estar vacío después de limpiarlo")

    return cleaned_text


def generate_embedding(text: str) -> list[float]:
    cleaned_text = clean_text_for_embedding(text)

    response = client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=cleaned_text,
    )

    embedding = response.data[0].embedding

    if len(embedding) != EMBEDDING_DIMENSIONS:
        raise ValueError(
            f"Dimensión inesperada del embedding. "
            f"Esperado: {EMBEDDING_DIMENSIONS}, recibido: {len(embedding)}"
        )

    return embedding


def generate_embeddings(texts: list[str]) -> list[list[float]]:
    if not texts:
        return []

    cleaned_texts = [
        clean_text_for_embedding(text)
        for text in texts
    ]

    response = client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=cleaned_texts,
    )

    embeddings = [
        item.embedding
        for item in response.data
    ]

    for embedding in embeddings:
        if len(embedding) != EMBEDDING_DIMENSIONS:
            raise ValueError(
                f"Dimensión inesperada del embedding. "
                f"Esperado: {EMBEDDING_DIMENSIONS}, recibido: {len(embedding)}"
            )

    return embeddings