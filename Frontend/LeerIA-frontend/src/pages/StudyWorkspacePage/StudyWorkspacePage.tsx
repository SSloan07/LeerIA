import { useEffect, useRef,useState } from "react";
import { BookOpen } from "lucide-react";

import { AppSidebar } from "../../widgets/AppSidebar/AppSidebar";
import { ChatComposer } from "../../widgets/ChatComposer/ChatComposer";
import { RightInspector } from "../../widgets/RightInspector/RightInspector";
import { UploadHero } from "../../widgets/UploadHero/UploadHero";
import { SubjectFormPanel } from "../../widgets/SubjectFormPanel/SubjectFormPanel";
import { askRagQuestion } from "../../shared/api/chat";
import { uploadDocument, processDocument,} from "../../shared/api/documents";


import type { Subject } from "../../shared/data/mock-data";

import {
  createSubject,
  getSubjects,
  updateSubject,
  type ApiSubject,
} from "../../shared/api/subjects";

type SidebarSubject = Subject & {
  description?: string | null;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function mapApiSubjectToSidebarSubject(subject: ApiSubject): SidebarSubject {
  return {
    id: subject.id,
    name: subject.name,
    description: subject.description,
    documents: 0,
    status: "Activa",
    icon: BookOpen,
    iconClassName: "bg-emerald-400/15 text-emerald-300",
  };
}

export function StudyWorkspacePage() {
  const [subjects, setSubjects] = useState<SidebarSubject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>();
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);

  const [panelMode, setPanelMode] = useState<"create" | "edit" | null>(null);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [uploadStatusMessage, setUploadStatusMessage] = useState<string | null>(
    null
  );

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

  async function loadSubjects() {
    const apiSubjects = await getSubjects();
    const sidebarSubjects = apiSubjects.map(mapApiSubjectToSidebarSubject);

    setSubjects(sidebarSubjects);

    if (!selectedSubjectId && sidebarSubjects.length > 0) {
      setSelectedSubjectId(sidebarSubjects[0].id);
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
        setSelectedSubjectId(createdSubject.id);
      }

      if (panelMode === "edit" && editingSubjectId) {
        const updatedSubject = await updateSubject(editingSubjectId, data);
        const sidebarSubject = mapApiSubjectToSidebarSubject(updatedSubject);

        setSubjects((currentSubjects) =>
          currentSubjects.map((subject) =>
            subject.id === updatedSubject.id ? sidebarSubject : subject
          )
        );
      }

      handleCloseSubjectPanel();
    } catch (error) {
      console.error("Error guardando materia:", error);
    }
  }

  async function handleSubmitMessage(message: string) {
    if (!selectedSubjectId) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setIsAsking(true);

    try {
      const result = await askRagQuestion({
        subjectId: selectedSubjectId,
        question: message,
        matchCount: 5,
      });

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.answer,
      };

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
    } catch (error) {
      console.error("Error preguntando al RAG:", error);

      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "No pude generar una respuesta con los documentos de esta materia.",
      };

      setMessages((currentMessages) => [...currentMessages, errorMessage]);
    } finally {
      setIsAsking(false);
    }
  }

  async function handleUploadFile(file: File) {
    if (!selectedSubjectId) {
      setUploadStatusMessage("Selecciona una materia antes de subir un documento.");
      return;
    }

    setIsUploadingDocument(true);
    setUploadStatusMessage("Subiendo documento...");

    try {
      const uploadedDocument = await uploadDocument({
        subjectId: selectedSubjectId,
        file,
      });

      setUploadStatusMessage("Documento subido. Procesando texto, chunks y embeddings...");

      const processedDocument = await processDocument(uploadedDocument.id);

      setUploadStatusMessage(
        `Documento procesado correctamente. Chunks creados: ${processedDocument.chunks_created}`
      );
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080B10] text-zinc-100">
      <BackgroundEffects />

      {panelMode && (
        <SubjectFormPanel
          mode={panelMode}
          initialName={editingSubject?.name}
          initialDescription={editingSubject?.description}
          onClose={handleCloseSubjectPanel}
          onSubmit={handleSubmitSubject}
        />
      )}

      <div className="relative z-10 grid h-screen grid-cols-[300px_1fr_360px] gap-4 p-4">
        <AppSidebar
          subjects={subjects}
          selectedSubjectId={selectedSubjectId}
          onSelectSubject={setSelectedSubjectId}
          onCreateSubject={handleOpenCreateSubject}
          onEditSubject={handleOpenEditSubject}
        />

        <main className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.035] shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          <section className="flex min-h-0 flex-1 flex-col px-8 py-10">
            {isLoadingSubjects ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-zinc-400">Cargando materias...</p>
              </div>
            ) : messages.length > 0 ? (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="chat-scroll flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={[
                        "max-w-[68%] rounded-3xl px-5 py-4 text-sm leading-6 shadow-[0_12px_40px_rgba(0,0,0,0.18)]",
                        message.role === "user"
                          ? "ml-auto bg-emerald-300 text-zinc-950"
                          : "mr-auto border border-white/[0.08] bg-white/[0.06] text-zinc-100",
                      ].join(" ")}
                    >
                      {message.content}
                    </div>
                  ))}

                  {isAsking && (
                    <div className="mr-auto max-w-[72%] rounded-3xl border border-white/[0.08] bg-white/[0.06] px-5 py-4 text-sm text-zinc-400">
                      Pensando con tus documentos...
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <UploadHero
                  disabled={!selectedSubjectId}
                  isUploading={isUploadingDocument}
                  statusMessage={uploadStatusMessage}
                  onUploadFile={handleUploadFile}
                />
              </div>
            )}
          </section>

          <div className="border-t border-white/[0.08] px-6 py-5">
            <ChatComposer
              disabled={!selectedSubjectId}
              isSubmitting={isAsking}
              isUploading={isUploadingDocument}
              onSubmitMessage={handleSubmitMessage}
              onUploadFile={handleUploadFile}
            />
          </div>
        </main>

        <RightInspector />
      </div>
    </div>
  );
}

function BackgroundEffects() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute left-[-10rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute bottom-[-12rem] right-[10rem] h-[32rem] w-[32rem] rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute right-[-10rem] top-[8rem] h-[26rem] w-[26rem] rounded-full bg-violet-500/10 blur-3xl" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.055),transparent_32rem)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_18rem)]" />
    </div>
  );
}