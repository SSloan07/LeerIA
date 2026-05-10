const API_URL = import.meta.env.VITE_API_URL;

export type GeneratedItemType =
  | "summary"
  | "quiz"
  | "flashcards"
  | "video_script";

export type GeneratedItemStatus = "processing" | "completed" | "failed";

export type SummaryContent = {
  title: string;
  overview: string;
  key_points: string[];
  sections: {
    heading: string;
    body: string;
  }[];
};

export type QuizContent = {
  title: string;
  questions: {
    question: string;
    options: string[];
    correct_answer: number;
    explanation: string;
  }[];
};

export type FlashcardsContent = {
  title: string;
  cards: {
    front: string;
    back: string;
  }[];
};

export type VideoScriptContent = {
  title: string;
  hook: string;
  script: {
    section: string;
    narration: string;
  }[];
  closing: string;
};

export type GeneratedItemContent =
  | SummaryContent
  | QuizContent
  | FlashcardsContent
  | VideoScriptContent
  | Record<string, unknown>;

export type GeneratedItem = {
  id: string;
  subject_id: string;
  document_id: string | null;
  type: GeneratedItemType;
  content: GeneratedItemContent;
  metadata?: Record<string, unknown>;
  status?: GeneratedItemStatus;
  created_at: string;
  updated_at?: string;
};

export type GenerateStudyItemPayload = {
  subject_id: string;
  type: GeneratedItemType;
  document_id?: string | null;
  force?: boolean;
  match_count?: number;
};

export type DeleteGeneratedItemResponse = {
  message: string;
  item: GeneratedItem;
};

async function parseApiError(response: Response): Promise<string> {
  try {
    const data = await response.json();

    if (typeof data?.detail === "string") {
      return data.detail;
    }

    return JSON.stringify(data);
  } catch {
    return "Error desconocido en la API";
  }
}

export async function generateStudyItem(
  payload: GenerateStudyItemPayload
): Promise<GeneratedItem> {
  const response = await fetch(`${API_URL}/generated-items/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject_id: payload.subject_id,
      type: payload.type,
      document_id: payload.document_id ?? null,
      force: payload.force ?? false,
      match_count: payload.match_count ?? 12,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function getGeneratedItemsBySubject(
  subjectId: string,
  type?: GeneratedItemType
): Promise<GeneratedItem[]> {
  const params = new URLSearchParams();

  if (type) {
    params.set("type", type);
  }

  const queryString = params.toString();

  const response = await fetch(
    `${API_URL}/generated-items/subject/${subjectId}${
      queryString ? `?${queryString}` : ""
    }`
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function getGeneratedItem(
  itemId: string
): Promise<GeneratedItem> {
  const response = await fetch(`${API_URL}/generated-items/${itemId}`);

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function deleteGeneratedItem(
  itemId: string
): Promise<DeleteGeneratedItemResponse> {
  const response = await fetch(`${API_URL}/generated-items/${itemId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}