import { useState } from "react";

import {
  getConversationMessages,
  sendConversationMessage,
  type Message,
} from "../../../shared/api/conversations";

export function useMessagesController() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isAsking, setIsAsking] = useState(false);

  async function loadMessagesByConversation(conversationId: string) {
    setIsLoadingMessages(true);

    try {
      const conversationMessages = await getConversationMessages(conversationId);
      setMessages(conversationMessages);

      return conversationMessages;
    } catch (error) {
      console.error("Error cargando mensajes:", error);
      setMessages([]);
      return [];
    } finally {
      setIsLoadingMessages(false);
    }
  }

  async function sendMessageToConversation(
    conversationId: string,
    content: string
  ) {
    const cleanMessage = content.trim();

    if (!cleanMessage) {
      return null;
    }

    const optimisticUserMessage: Message = {
      id: `temp-${crypto.randomUUID()}`,
      conversation_id: conversationId,
      role: "user",
      content: cleanMessage,
      metadata: {},
      created_at: new Date().toISOString(),
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      optimisticUserMessage,
    ]);

    setIsAsking(true);

    try {
      const result = await sendConversationMessage(conversationId, {
        content: cleanMessage,
      });

      setMessages((currentMessages) => [
        ...currentMessages.filter(
          (messageItem) => messageItem.id !== optimisticUserMessage.id
        ),
        result.user_message,
        result.assistant_message,
      ]);

      return result;
    } catch (error) {
      console.error("Error preguntando en la conversación:", error);

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        conversation_id: conversationId,
        role: "assistant",
        content:
          "No pude generar una respuesta con los documentos de esta materia.",
        metadata: {},
        created_at: new Date().toISOString(),
      };

      setMessages((currentMessages) => [...currentMessages, errorMessage]);

      throw error;
    } finally {
      setIsAsking(false);
    }
  }

  function clearMessages() {
    setMessages([]);
  }

  return {
    messages,
    setMessages,
    isLoadingMessages,
    setIsLoadingMessages,
    isAsking,
    loadMessagesByConversation,
    sendMessageToConversation,
    clearMessages,
  };
}