import { MessageSquare } from "lucide-react";

import type { ConversationRowProps } from "../types";

export function ConversationRow({
  conversation,
  selected,
  onClick,
}: ConversationRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={conversation.title}
      className={[
        "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs transition",
        selected
          ? "bg-white/[0.10] text-zinc-50"
          : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100",
      ].join(" ")}
    >
      <MessageSquare className="h-3.5 w-3.5 shrink-0" />

      <span className="truncate">
        {conversation.title || "Nueva conversación"}
      </span>
    </button>
  );
}