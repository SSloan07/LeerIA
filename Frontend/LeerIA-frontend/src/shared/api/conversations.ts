const API_URL = import.meta.env.VITE_API_URL;

export type Conversation = {
  id: string;
  subject_id: string;
  title: string;
  created_at: string;
  updated_at?: string;
};

export type MessageRole = "user" | "assistant" | "system";

export type Message = {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  metadata?: Record<string, unknown>;
  created_at: string;
};

export type CreateConversationPayload = {
  subject_id: string;
  title?: string;
};

export type SendConversationMessagePayload = {
  content: string;
};

export type SendConversationMessageResponse = {
  user_message: Message;
  assistant_message: Message;
  chunks: unknown[];
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

export async function createConversation(
  payload: CreateConversationPayload
): Promise<Conversation> {
  const response = await fetch(`${API_URL}/conversations/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject_id: payload.subject_id,
      title: payload.title ?? "Nueva conversación",
    }),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function getConversationsBySubject(
  subjectId: string
): Promise<Conversation[]> {
  const response = await fetch(`${API_URL}/conversations/subject/${subjectId}`);

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function getConversation(
  conversationId: string
): Promise<Conversation> {
  const response = await fetch(`${API_URL}/conversations/${conversationId}`);

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function getConversationMessages(
  conversationId: string
): Promise<Message[]> {
  const response = await fetch(
    `${API_URL}/conversations/${conversationId}/messages`
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function sendConversationMessage(
  conversationId: string,
  payload: SendConversationMessagePayload
): Promise<SendConversationMessageResponse> {
  const response = await fetch(
    `${API_URL}/conversations/${conversationId}/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function getOrCreateSubjectConversation(
  subjectId: string,
  title = "Nueva conversación"
): Promise<Conversation> {
  const conversations = await getConversationsBySubject(subjectId);

  if (conversations.length > 0) {
    return conversations[0];
  }

  return createConversation({
    subject_id: subjectId,
    title,
  });
}