import { Plus } from "lucide-react";

import type { ConversationListProps } from "../types";
import { ConversationRow } from "./ConversationRow";

export function ConversationList({
  conversations,
  selectedConversationId,
  loadingConversations,
  onSelectConversation,
  onCreateConversation,
}: ConversationListProps) {
  return (
    <div className="mt-4 border-t border-white/[0.08] pt-3">
      <button
        type="button"
        onClick={onCreateConversation}
        className="mb-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-emerald-300 transition hover:bg-emerald-300/[0.08]"
      >
        <Plus className="h-3.5 w-3.5" />
        Nueva conversación
      </button>

      {loadingConversations ? (
        <div className="space-y-2 px-1">
          <div className="h-8 animate-pulse rounded-xl bg-white/[0.06]" />
          <div className="h-8 animate-pulse rounded-xl bg-white/[0.04]" />
        </div>
      ) : conversations.length > 0 ? (
        <div className="space-y-1">
          {conversations.map((conversation) => (
            <ConversationRow
              key={conversation.id}
              conversation={conversation}
              selected={conversation.id === selectedConversationId}
              onClick={() => onSelectConversation(conversation.id)}
            />
          ))}
        </div>
      ) : (
        <p className="px-3 py-2 text-xs leading-relaxed text-zinc-500">
          Esta materia todavía no tiene conversaciones.
        </p>
      )}
    </div>
  );
}