import { useEffect, useRef } from "react";

import { AppSidebar } from "../../widgets/AppSidebar/AppSidebar";
import { ChatComposer } from "../../widgets/ChatComposer/ChatComposer";
import { RightInspector } from "../../widgets/RightInspector/RightInspector";
import { SubjectFormPanel } from "../../widgets/SubjectFormPanel/SubjectFormPanel";

import { BackgroundEffects } from "./components/BackgroundEffects";
import { WorkspaceMain } from "./components/WorkspaceMain";

import { useSubjectsController } from "./hooks/useSubjectsController";
import { useDocumentsController } from "./hooks/useDocumentsController";
import { useConversationsController } from "./hooks/useConversationsController";
import { useMessagesController } from "./hooks/useMessagesController";
import { useSubjectPanel } from "./hooks/useSubjectPanelController";
import { useAutoScroll } from "./hooks/useAutoScroll";

export function StudyWorkspacePage() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const subjectsController = useSubjectsController();

  const documentsController = useDocumentsController({
    onDocumentCountChange: subjectsController.updateSubjectDocumentCount,
  });

  const conversationsController = useConversationsController();

  const messagesController = useMessagesController();

  const subjectPanel = useSubjectPanel(subjectsController.subjects);

  useAutoScroll(messagesEndRef, [
    messagesController.messages,
    messagesController.isAsking,
    messagesController.isLoadingMessages,
  ]);

  async function handleSelectSubject(subjectId: string) {
    subjectsController.setSelectedSubjectId(subjectId);

    conversationsController.clearSelectedConversation();
    messagesController.clearMessages();
    documentsController.clearUploadStatus();

    conversationsController.setLoadingConversationsSubjectId(subjectId);
    messagesController.setIsLoadingMessages(true);

    try {
      const [subjectConversations] = await Promise.all([
        conversationsController.loadConversationsBySubject(subjectId),
        documentsController.loadDocumentsBySubject(subjectId),
      ]);

      const firstConversation = subjectConversations[0];

      if (!firstConversation) {
        conversationsController.clearSelectedConversation();
        messagesController.clearMessages();
        return;
      }

      conversationsController.setSelectedConversationId(firstConversation.id);

      await messagesController.loadMessagesByConversation(
        firstConversation.id
      );
    } catch (error) {
      console.error("Error seleccionando materia:", error);

      conversationsController.clearSelectedConversation();
      messagesController.clearMessages();
    } finally {
      conversationsController.setLoadingConversationsSubjectId(null);
      messagesController.setIsLoadingMessages(false);
    }
  }

  async function handleSelectConversation(conversationId: string) {
    conversationsController.setSelectedConversationId(conversationId);
    documentsController.clearUploadStatus();

    await messagesController.loadMessagesByConversation(conversationId);
  }

  async function handleCreateConversation(subjectId: string) {
    subjectsController.setSelectedSubjectId(subjectId);

    conversationsController.setLoadingConversationsSubjectId(subjectId);
    messagesController.setIsLoadingMessages(true);
    documentsController.clearUploadStatus();

    try {
      const subject = subjectsController.subjects.find(
        (item) => item.id === subjectId
      );

      const createdConversation =
        await conversationsController.createConversationForSubject(
          subjectId,
          subject ? `Chat de ${subject.name}` : "Nueva conversación"
        );

      conversationsController.setSelectedConversationId(
        createdConversation.id
      );

      messagesController.clearMessages();

      if (subjectsController.selectedSubjectId !== subjectId) {
        await documentsController.loadDocumentsBySubject(subjectId);
      }
    } catch (error) {
      console.error("Error creando conversación:", error);
    } finally {
      conversationsController.setLoadingConversationsSubjectId(null);
      messagesController.setIsLoadingMessages(false);
    }
  }

  async function handleSubmitSubject(data: {
    name: string;
    description?: string | null;
  }) {
    try {
      if (subjectPanel.panelMode === "create") {
        const createdSubject = await subjectsController.createNewSubject(data);

        conversationsController.initializeSubjectConversations(
          createdSubject.id
        );

        subjectsController.setSelectedSubjectId(createdSubject.id);
        conversationsController.clearSelectedConversation();
        documentsController.clearDocuments();
        messagesController.clearMessages();
        documentsController.clearUploadStatus();
      }

      if (
        subjectPanel.panelMode === "edit" &&
        subjectPanel.editingSubjectId
      ) {
        await subjectsController.updateExistingSubject(
          subjectPanel.editingSubjectId,
          data
        );
      }

      subjectPanel.handleCloseSubjectPanel();
    } catch (error) {
      console.error("Error guardando materia:", error);
    }
  }

  async function handleSubmitMessage(message: string) {
    if (!conversationsController.selectedConversationId) {
      return;
    }

    try {
      await messagesController.sendMessageToConversation(
        conversationsController.selectedConversationId,
        message
      );

      if (subjectsController.selectedSubjectId) {
        await conversationsController.loadConversationsBySubject(
          subjectsController.selectedSubjectId
        );
      }
    } catch {
      // El error ya se maneja dentro de useMessagesController.
    }
  }

  async function handleUploadFile(file: File) {
    if (!subjectsController.selectedSubjectId) {
      documentsController.setUploadStatusMessage(
        "Selecciona una materia antes de subir un documento."
      );
      return;
    }

    try {
      await documentsController.uploadAndProcessDocument(
        subjectsController.selectedSubjectId,
        file
      );
    } catch {
      // El error ya se maneja dentro de useDocumentsController.
    }
  }

  useEffect(() => {
    async function initialLoad() {
      try {
        const loadedSubjects = await subjectsController.loadSubjects();

        if (loadedSubjects.length > 0) {
          await handleSelectSubject(loadedSubjects[0].id);
        }
      } catch (error) {
        console.error("Error cargando materias:", error);
      } finally {
        subjectsController.setIsLoadingSubjects(false);
      }
    }

    initialLoad();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080B10] text-zinc-100">
      <BackgroundEffects />

      {subjectPanel.panelMode && (
        <SubjectFormPanel
          mode={subjectPanel.panelMode}
          initialName={subjectPanel.editingSubject?.name}
          initialDescription={subjectPanel.editingSubject?.description}
          onClose={subjectPanel.handleCloseSubjectPanel}
          onSubmit={handleSubmitSubject}
        />
      )}

      <div className="relative z-10 grid h-screen grid-cols-[300px_1fr_360px] gap-4 p-4">
        <AppSidebar
          subjects={subjectsController.subjects}
          selectedSubjectId={subjectsController.selectedSubjectId}
          selectedConversationId={
            conversationsController.selectedConversationId
          }
          conversationsBySubject={
            conversationsController.conversationsBySubject
          }
          loadingConversationsSubjectId={
            conversationsController.loadingConversationsSubjectId
          }
          onSelectSubject={handleSelectSubject}
          onSelectConversation={handleSelectConversation}
          onCreateConversation={handleCreateConversation}
          onCreateSubject={subjectPanel.handleOpenCreateSubject}
          onEditSubject={subjectPanel.handleOpenEditSubject}
        />

        <main className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.035] shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          <section className="flex min-h-0 flex-1 flex-col px-8 py-10">
            <WorkspaceMain
              isLoadingSubjects={subjectsController.isLoadingSubjects}
              isLoadingMessages={messagesController.isLoadingMessages}
              selectedSubjectId={subjectsController.selectedSubjectId}
              selectedConversationId={
                conversationsController.selectedConversationId
              }
              messages={messagesController.messages}
              isAsking={messagesController.isAsking}
              isUploadingDocument={documentsController.isUploadingDocument}
              uploadStatusMessage={documentsController.uploadStatusMessage}
              messagesEndRef={messagesEndRef}
              onUploadFile={handleUploadFile}
            />
          </section>

          <div className="border-t border-white/[0.08] px-6 py-5">
            <ChatComposer
              disabled={
                !subjectsController.selectedSubjectId ||
                !conversationsController.selectedConversationId ||
                messagesController.isLoadingMessages
              }
              isSubmitting={messagesController.isAsking}
              isUploading={documentsController.isUploadingDocument}
              onSubmitMessage={handleSubmitMessage}
              onUploadFile={handleUploadFile}
            />
          </div>
        </main>

        <RightInspector
          documents={documentsController.documents}
          isLoadingDocuments={documentsController.isLoadingDocuments}
        />
      </div>
    </div>
  );
}