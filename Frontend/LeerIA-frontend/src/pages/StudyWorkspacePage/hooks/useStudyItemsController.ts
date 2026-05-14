import { useState } from "react";

import {
  generateStudyItem,
  type GeneratedItem,
  type GeneratedItemType,
} from "../../../shared/api/generatedItems";

export type ActiveStudyType = GeneratedItemType | "chat";

export function useStudyItemsController() {
  const [activeStudyType, setActiveStudyType] =
    useState<ActiveStudyType>("chat");

  const [activeStudyItem, setActiveStudyItem] =
    useState<GeneratedItem | null>(null);

  const [isGeneratingStudyItem, setIsGeneratingStudyItem] = useState(false);
  const [studyItemError, setStudyItemError] = useState<string | null>(null);

  function showChat() {
    setActiveStudyType("chat");
  }

  function clearStudyItem() {
    setActiveStudyType("chat");
    setActiveStudyItem(null);
    setStudyItemError(null);
  }

  async function generateStudyItemForSubject(
    subjectId: string,
    conversationId: string,
    type: GeneratedItemType
  ) {
    setActiveStudyType(type);
    setIsGeneratingStudyItem(true);
    setStudyItemError(null);

    try {
      const item = await generateStudyItem({
        subject_id: subjectId,
        conversation_id: conversationId,
        type,
        force: true,
        match_count: 12,
      });

      setActiveStudyItem(item);

      return item;
    } catch (error) {
      console.error("Error generando material de estudio:", error);

      setStudyItemError(
        error instanceof Error
          ? error.message
          : "No se pudo generar el material de estudio."
      );

      setActiveStudyItem(null);

      throw error;
    } finally {
      setIsGeneratingStudyItem(false);
    }
  }

  return {
    activeStudyType,
    activeStudyItem,
    isGeneratingStudyItem,
    studyItemError,

    showChat,
    clearStudyItem,
    generateStudyItemForSubject,
  };
}