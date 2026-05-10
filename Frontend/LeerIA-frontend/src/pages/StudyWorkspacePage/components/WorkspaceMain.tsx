import type { RefObject } from "react";

import { UploadHero } from "../../../widgets/UploadHero/UploadHero";

import type { Message } from "../../../shared/api/conversations";
import { ChatMessages } from "./ChatMessages";
import { EmptyConversationState } from "./EmptyConversationState";

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
}: WorkspaceMainProps) {
  if (isLoadingSubjects) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-zinc-400">Cargando materias...</p>
      </div>
    );
  }

  if (isLoadingMessages) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-zinc-400">Cargando conversación...</p>
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