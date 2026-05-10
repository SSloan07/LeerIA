import type { RefObject } from "react";

import type { Message } from "../../../shared/api/conversations";

type ChatMessagesProps = {
  messages: Message[];
  isAsking: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
};

export function ChatMessages({
  messages,
  isAsking,
  messagesEndRef,
}: ChatMessagesProps) {
  return (
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
          <div className="mr-auto max-w-[68%] rounded-3xl border border-white/[0.08] bg-white/[0.06] px-5 py-4 text-sm text-zinc-400">
            Pensando con tus documentos...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}