import type { RefObject } from "react";

import type { Message } from "../../../shared/api/conversations";
import { MessageBubble } from "./MessageBubble";

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
            <MessageBubble key={message.id} message={message} />
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