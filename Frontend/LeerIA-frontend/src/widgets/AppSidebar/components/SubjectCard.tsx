import { ChevronRight, Pencil } from "lucide-react";

import type { SubjectCardProps } from "../types";
import { ConversationList } from "./ConversationList";

export function SubjectCard({
  subject,
  selected,
  conversations,
  selectedConversationId,
  loadingConversations,
  onClick,
  onEdit,
  onSelectConversation,
  onCreateConversation,
}: SubjectCardProps) {
  const Icon = subject.icon;

  return (
    <div
      className={[
        "group w-full rounded-2xl border p-4 text-left transition duration-300",
        selected
          ? "border-emerald-300/45 bg-emerald-400/[0.08] shadow-[0_0_34px_rgba(52,211,153,0.16)]"
          : "border-white/[0.07] bg-white/[0.035] hover:border-white/[0.14] hover:bg-white/[0.06]",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onClick}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <div
            className={[
              "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
              subject.iconClassName,
            ].join(" ")}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p
              title={subject.name}
              className="truncate text-sm font-semibold text-zinc-100"
            >
              {subject.name}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              {subject.documents} documentos
              {selected && (
                <>
                  <span className="mx-1.5">•</span>
                  <span className="text-emerald-300">{subject.status}</span>
                </>
              )}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Editar materia"
            onClick={onEdit}
            className="grid h-8 w-8 place-items-center rounded-xl text-zinc-500 opacity-0 transition hover:bg-white/[0.08] hover:text-zinc-100 group-hover:opacity-100"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <ChevronRight
            className={[
              "h-5 w-5 transition",
              selected
                ? "rotate-90 text-emerald-200"
                : "text-zinc-600 group-hover:translate-x-0.5 group-hover:text-zinc-300",
            ].join(" ")}
          />
        </div>
      </div>

      {selected && (
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          loadingConversations={loadingConversations}
          onSelectConversation={onSelectConversation}
          onCreateConversation={onCreateConversation}
        />
      )}
    </div>
  );
}