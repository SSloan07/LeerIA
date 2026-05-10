import { useEffect, useState, type RefObject } from "react";

import {
  uploadDocument,
  processDocument,
  getDocumentsBySubject,
  type ApiDocument,
} from "../../../shared/api/documents";

import {
  createSubject,
  getSubjects,
  updateSubject,
} from "../../../shared/api/subjects";

import {
  createConversation,
  getConversationsBySubject,
  getConversationMessages,
  sendConversationMessage,
  type Conversation,
  type Message,
} from "../../../shared/api/conversations";

import { mapApiSubjectToSidebarSubject } from "../mappers";
import type { SidebarSubject } from "../types";

export function useStudyWorkspace(
  messagesEndRef: RefObject<HTMLDivElement | null>
) {
  const [subjects, setSubjects] = useState<SidebarSubject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  );

  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);

  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

  const [conversationsBySubject, setConversationsBySubject] = useState<
    Record<string, Conversation[]>
  >({});

  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const [loadingConversationsSubjectId, setLoadingConversationsSubjectId] =
    useState<string | null>(null);

  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const [panelMode, setPanelMode] = useState<"create" | "edit" | null>(null);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isAsking, setIsAsking] = useState(false);

  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [uploadStatusMessage, setUploadStatusMessage] = useState<string | null>(
    null
  );

  const editingSubject = subjects.find(
    (subject) => subject.id === editingSubjectId
  );

  function handleOpenCreateSubject() {
    setEditingSubjectId(null);
    setPanelMode("create");
  }

  function handleOpenEditSubject(subjectId: string) {
    setEditingSubjectId(subjectId);
    setPanelMode("edit");
  }

  function handleCloseSubjectPanel() {
    setPanelMode(null);
    setEditingSubjectId(null);
  }

  async function loadDocumentsBySubject(subjectId: string) {
    setIsLoadingDocuments(true);

    try {
      const subjectDocuments = await getDocumentsBySubject(subjectId);

      setDocuments(subjectDocuments);

      setSubjects((currentSubjects) =>
        currentSubjects.map((subject) =>
          subject.id === subjectId
            ? {
                ...subject,
                documents: subjectDocuments.length,
              }
            : subject
        )
      );
    } catch (error) {
      console.error("Error cargando documentos:", error);
      setDocuments([]);
    } finally {
      setIsLoadingDocuments(false);
    }
  }

  async function loadConversationsBySubject(subjectId: string) {
    const subjectConversations = await getConversationsBySubject(subjectId);

    setConversationsBySubject((current) => ({
      ...current,
      [subjectId]: subjectConversations,
    }));

    return subjectConversations;
  }

  async function loadMessagesByConversation(conversationId: string) {
    setIsLoadingMessages(true);

    try {
      const conversationMessages = await getConversationMessages(conversationId);
      setMessages(conversationMessages);
    } catch (error) {
      console.error("Error cargando mensajes:", error);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  }

  async function handleSelectSubject(subjectId: string) {
    setSelectedSubjectId(subjectId);
    setSelectedConversationId(null);
    setMessages([]);
    setUploadStatusMessage(null);

    setLoadingConversationsSubjectId(subjectId);
    setIsLoadingMessages(true);

    try {
      const [subjectConversations] = await Promise.all([
        loadConversationsBySubject(subjectId),
        loadDocumentsBySubject(subjectId),
      ]);

      const firstConversation = subjectConversations[0];

      if (firstConversation) {
        setSelectedConversationId(firstConversation.id);

        const conversationMessages = await getConversationMessages(
          firstConversation.id
        );

        setMessages(conversationMessages);
      } else {
        setSelectedConversationId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error seleccionando materia:", error);
      setSelectedConversationId(null);
      setMessages([]);
    } finally {
      setLoadingConversationsSubjectId(null);
      setIsLoadingMessages(false);
    }
  }

  async function handleSelectConversation(conversationId: string) {
    setSelectedConversationId(conversationId);
    setUploadStatusMessage(null);

    await loadMessagesByConversation(conversationId);
  }

  async function handleCreateConversation(subjectId: string) {
    setSelectedSubjectId(subjectId);
    setLoadingConversationsSubjectId(subjectId);
    setIsLoadingMessages(true);
    setUploadStatusMessage(null);

    try {
      const subject = subjects.find((item) => item.id === subjectId);

      const createdConversation = await createConversation({
        subject_id: subjectId,
        title: subject ? `Chat de ${subject.name}` : "Nueva conversación",
      });

      setConversationsBySubject((current) => ({
        ...current,
        [subjectId]: [createdConversation, ...(current[subjectId] ?? [])],
      }));

      setSelectedConversationId(createdConversation.id);
      setMessages([]);

      if (selectedSubjectId !== subjectId) {
        await loadDocumentsBySubject(subjectId);
      }
    } catch (error) {
      console.error("Error creando conversación:", error);
    } finally {
      setLoadingConversationsSubjectId(null);
      setIsLoadingMessages(false);
    }
  }

  async function loadSubjects() {
    const apiSubjects = await getSubjects();
    const sidebarSubjects = apiSubjects.map(mapApiSubjectToSidebarSubject);

    setSubjects(sidebarSubjects);

    if (sidebarSubjects.length > 0) {
      await handleSelectSubject(sidebarSubjects[0].id);
    }
  }

  async function handleSubmitSubject(data: {
    name: string;
    description?: string | null;
  }) {
    try {
      if (panelMode === "create") {
        const createdSubject = await createSubject(data);
        const sidebarSubject = mapApiSubjectToSidebarSubject(createdSubject);

        setSubjects((currentSubjects) => [...currentSubjects, sidebarSubject]);

        setConversationsBySubject((current) => ({
          ...current,
          [createdSubject.id]: [],
        }));

        setSelectedSubjectId(createdSubject.id);
        setSelectedConversationId(null);
        setDocuments([]);
        setMessages([]);
        setUploadStatusMessage(null);
      }

      if (panelMode === "edit" && editingSubjectId) {
        const updatedSubject = await updateSubject(editingSubjectId, data);
        const sidebarSubject = mapApiSubjectToSidebarSubject(updatedSubject);

        setSubjects((currentSubjects) =>
          currentSubjects.map((subject) =>
            subject.id === updatedSubject.id
              ? {
                  ...sidebarSubject,
                  documents: subject.documents,
                }
              : subject
          )
        );
      }

      handleCloseSubjectPanel();
    } catch (error) {
      console.error("Error guardando materia:", error);
    }
  }

  async function handleSubmitMessage(message: string) {
    if (!selectedConversationId) {
      return;
    }

    const cleanMessage = message.trim();

    if (!cleanMessage) {
      return;
    }

    const conversationId = selectedConversationId;

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

      if (selectedSubjectId) {
        await loadConversationsBySubject(selectedSubjectId);
      }
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
    } finally {
      setIsAsking(false);
    }
  }

  async function handleUploadFile(file: File) {
    if (!selectedSubjectId) {
      setUploadStatusMessage(
        "Selecciona una materia antes de subir un documento."
      );
      return;
    }

    setIsUploadingDocument(true);
    setUploadStatusMessage("Subiendo documento...");

    try {
      const uploadedDocument = await uploadDocument({
        subjectId: selectedSubjectId,
        file,
      });

      setUploadStatusMessage(
        "Documento subido. Procesando texto, chunks y embeddings..."
      );

      const processedDocument = await processDocument(uploadedDocument.id);

      setUploadStatusMessage(
        `Documento procesado correctamente. Chunks creados: ${processedDocument.chunks_created}`
      );

      await loadDocumentsBySubject(selectedSubjectId);
    } catch (error) {
      console.error("Error subiendo/procesando documento:", error);

      setUploadStatusMessage(
        error instanceof Error
          ? error.message
          : "No se pudo subir o procesar el documento."
      );
    } finally {
      setIsUploadingDocument(false);
    }
  }

  useEffect(() => {
    async function initialLoad() {
      try {
        await loadSubjects();
      } catch (error) {
        console.error("Error cargando materias:", error);
      } finally {
        setIsLoadingSubjects(false);
      }
    }

    initialLoad();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isAsking, isLoadingMessages, messagesEndRef]);

  return {
    subjects,
    selectedSubjectId,
    isLoadingSubjects,

    documents,
    isLoadingDocuments,

    conversationsBySubject,
    selectedConversationId,
    loadingConversationsSubjectId,
    isLoadingMessages,

    panelMode,
    editingSubject,
    messages,
    isAsking,

    isUploadingDocument,
    uploadStatusMessage,

    handleOpenCreateSubject,
    handleOpenEditSubject,
    handleCloseSubjectPanel,

    handleSelectSubject,
    handleSelectConversation,
    handleCreateConversation,

    handleSubmitSubject,
    handleSubmitMessage,
    handleUploadFile,
  };
}