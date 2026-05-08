from dataclasses import dataclass
from typing import Any


@dataclass
class TextChunk:
    chunk_index: int
    content: str
    metadata: dict[str, Any]


def split_text_into_chunks(
    text: str,
    chunk_size: int = 1000,  # Tamaño máximo de cada chunk en caracteres
    overlap: int = 150,      # Cantidad de caracteres solapados entre chunks
) -> list[TextChunk]:
    if not text or not text.strip():
        return []

    if chunk_size <= 0:
        raise ValueError("chunk_size debe ser mayor que 0")

    if overlap < 0:
        raise ValueError("overlap no puede ser negativo")

    if overlap >= chunk_size:
        raise ValueError("overlap debe ser menor que chunk_size")

    clean_text = " ".join(text.split())

    chunks: list[TextChunk] = []
    start = 0
    chunk_index = 0

    while start < len(clean_text):
        end = start + chunk_size
        chunk_text = clean_text[start:end].strip()

        if chunk_text:
            chunks.append(
                TextChunk(
                    chunk_index=chunk_index,
                    content=chunk_text,
                    metadata={
                        "chunk_size": len(chunk_text),
                        "start_char": start,
                        "end_char": min(end, len(clean_text)),
                    },
                )
            )

            chunk_index += 1

        start += chunk_size - overlap

    return chunks