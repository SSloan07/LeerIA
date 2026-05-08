export type RagSource = {
  id: string;
  document_id: string;
  subject_id: string;
  content: string;
  metadata: {
    file_name?: string;
    storage_path?: string;
    start_char?: number;
    end_char?: number;
    chunk_size?: number;
  };
  similarity: number;
};

type RagChatResponse = {
  message: string;
  data: {
    answer: string;
    sources: RagSource[];
  };
};

const API_URL = import.meta.env.VITE_API_URL;

export async function askRagQuestion(params: {
  subjectId: string;
  question: string;
  matchCount?: number;
}) {
  const response = await fetch(`${API_URL}/chat/rag`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject_id: params.subjectId,
      question: params.question,
      match_count: params.matchCount ?? 5,
    }),
  });

  if (!response.ok) {
    throw new Error("Error al generar respuesta RAG");
  }

  const result: RagChatResponse = await response.json();

  return result.data;
}