import type { RefObject } from "react";

import { UploadHero } from "../../../widgets/UploadHero/UploadHero";

import type { Message } from "../../../shared/api/conversations";
import type {
  GeneratedItem,
  GeneratedItemType,
} from "../../../shared/api/generatedItems";

import { ChatMessages } from "./ChatMessages";
import { EmptyConversationState } from "./EmptyConversationState";
import { FlashcardsViewer } from "./FlashcardsViewer";
import { QuizViewer } from "./QuizViewer";
import { SummaryViewer } from "./SummaryViewer";

type ActiveStudyType = GeneratedItemType | "chat";

type WorkspaceMainProps = {
  isLoadingSubjects: boolean;
  isLoadingMessages: boolean;
  selectedSubjectId: string | null;
  selectedConversationId: string | null;
  messages: Message[];
  isAsking: boolean;
  isUploadingDocument: boolean;
  uploadStatusMessage: string | null;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  onUploadFile: (file: File) => void;

  activeStudyType: ActiveStudyType;
  activeStudyItem: GeneratedItem | null;
  isGeneratingStudyItem: boolean;
  studyItemError: string | null;
  onBackToChat: () => void;
};

export function WorkspaceMain({
  isLoadingSubjects,
  isLoadingMessages,
  selectedSubjectId,
  selectedConversationId,
  messages,
  isAsking,
  isUploadingDocument,
  uploadStatusMessage,
  messagesEndRef,
  onUploadFile,
  activeStudyType,
  activeStudyItem,
  isGeneratingStudyItem,
  studyItemError,
  onBackToChat,
}: WorkspaceMainProps) {
  if (isLoadingSubjects) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-zinc-400">Cargando materias...</p>
      </div>
    );
  }

  if (!selectedSubjectId) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-zinc-400">
          Selecciona una materia para empezar.
        </p>
      </div>
    );
  }

  if (activeStudyType !== "chat") {
    return (
      <StudyItemView
        activeStudyType={activeStudyType}
        activeStudyItem={activeStudyItem}
        isGeneratingStudyItem={isGeneratingStudyItem}
        studyItemError={studyItemError}
        onBackToChat={onBackToChat}
      />
    );
  }

  if (isLoadingMessages) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-zinc-400">Cargando conversación...</p>
      </div>
    );
  }

  if (!selectedConversationId) {
    return <EmptyConversationState />;
  }

  if (messages.length > 0) {
    return (
      <ChatMessages
        messages={messages}
        isAsking={isAsking}
        messagesEndRef={messagesEndRef}
      />
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <UploadHero
        disabled={!selectedSubjectId}
        isUploading={isUploadingDocument}
        statusMessage={uploadStatusMessage}
        onUploadFile={onUploadFile}
      />
    </div>
  );
}

type StudyItemViewProps = {
  activeStudyType: GeneratedItemType;
  activeStudyItem: GeneratedItem | null;
  isGeneratingStudyItem: boolean;
  studyItemError: string | null;
  onBackToChat: () => void;
};

function StudyItemView({
  activeStudyType,
  activeStudyItem,
  isGeneratingStudyItem,
  studyItemError,
  onBackToChat,
}: StudyItemViewProps) {
  const title = getStudyTypeLabel(activeStudyType);

  if (isGeneratingStudyItem) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="max-w-md rounded-3xl border border-white/[0.08] bg-white/[0.04] p-6 text-center">
          <p className="text-lg font-semibold text-zinc-100">
            Generando {title.toLowerCase()}...
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            LeerIA está usando los documentos de esta materia para crear el
            material de estudio.
          </p>
        </div>
      </div>
    );
  }

  if (studyItemError) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="max-w-md rounded-3xl border border-red-400/20 bg-red-400/[0.06] p-6 text-center">
          <p className="text-lg font-semibold text-red-200">
            No se pudo generar el material
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {studyItemError}
          </p>

          <button
            type="button"
            onClick={onBackToChat}
            className="mt-5 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            Volver al chat
          </button>
        </div>
      </div>
    );
  }

  if (!activeStudyItem) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="max-w-md rounded-3xl border border-white/[0.08] bg-white/[0.04] p-6 text-center">
          <p className="text-lg font-semibold text-zinc-100">{title}</p>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Selecciona una herramienta del panel derecho para generar material
            de estudio.
          </p>

          <button
            type="button"
            onClick={onBackToChat}
            className="mt-5 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            Volver al chat
          </button>
        </div>
      </div>
    );
  }

  if (activeStudyType === "flashcards") {
    return (
      <FlashcardsViewer
        item={activeStudyItem}
        onBackToChat={onBackToChat}
      />
    );
  }
  if (activeStudyType === "quiz") {
    return (
      <QuizViewer
        item={activeStudyItem}
        onBackToChat={onBackToChat}
      />
    );
  }
  if (activeStudyType === "summary") {
    return (
      <SummaryViewer
        item={activeStudyItem}
        onBackToChat={onBackToChat}
      />
    );
  }

  return (
    <GenericStudyItemView
      title={title}
      item={activeStudyItem}
      onBackToChat={onBackToChat}
    />
  );
}

type GenericStudyItemViewProps = {
  title: string;
  item: GeneratedItem;
  onBackToChat: () => void;
};

function GenericStudyItemView({
  title,
  item,
  onBackToChat,
}: GenericStudyItemViewProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
            {title}
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
            {getGeneratedItemTitle(item)}
          </h2>
        </div>

        <button
          type="button"
          onClick={onBackToChat}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.08] hover:text-zinc-100"
        >
          Volver al chat
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-[2rem] border border-white/[0.08] bg-white/[0.035] p-6">
        <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-zinc-300">
          {JSON.stringify(item.content, null, 2)}
        </pre>
      </div>
    </div>
  );
}

function getStudyTypeLabel(type: GeneratedItemType): string {
  const labels: Record<GeneratedItemType, string> = {
    summary: "Resumen",
    quiz: "Quiz",
    flashcards: "Flashcards",
    video_script: "Guion de video",
  };

  return labels[type];
}

function getGeneratedItemTitle(item: GeneratedItem): string {
  const content = item.content;

  if (
    content &&
    typeof content === "object" &&
    "title" in content &&
    typeof content.title === "string"
  ) {
    return content.title;
  }

  return "Material de estudio generado";
}