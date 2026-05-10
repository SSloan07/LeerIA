import { useState } from "react";

import {
  createConversation,
  getConversationsBySubject,
  type Conversation,
} from "../../../shared/api/conversations";

export function useConversationsController() {
  const [conversationsBySubject, setConversationsBySubject] = useState<
    Record<string, Conversation[]>
  >({});

  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const [loadingConversationsSubjectId, setLoadingConversationsSubjectId] =
    useState<string | null>(null);

  async function loadConversationsBySubject(subjectId: string) {
    const subjectConversations = await getConversationsBySubject(subjectId);

    setConversationsBySubject((current) => ({
      ...current,
      [subjectId]: subjectConversations,
    }));

    return subjectConversations;
  }

  async function createConversationForSubject(
    subjectId: string,
    title = "Nueva conversación"
  ) {
    const createdConversation = await createConversation({
      subject_id: subjectId,
      title,
    });

    setConversationsBySubject((current) => ({
      ...current,
      [subjectId]: [createdConversation, ...(current[subjectId] ?? [])],
    }));

    setSelectedConversationId(createdConversation.id);

    return createdConversation;
  }

  function clearSelectedConversation() {
    setSelectedConversationId(null);
  }

  function initializeSubjectConversations(subjectId: string) {
    setConversationsBySubject((current) => ({
      ...current,
      [subjectId]: current[subjectId] ?? [],
    }));
  }

  return {
    conversationsBySubject,
    selectedConversationId,
    setSelectedConversationId,
    loadingConversationsSubjectId,
    setLoadingConversationsSubjectId,
    loadConversationsBySubject,
    createConversationForSubject,
    clearSelectedConversation,
    initializeSubjectConversations,
  };
}