import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { Message } from "../../../shared/api/conversations";

type MessageBubbleProps = {
  message: Message;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
        className={[
            "rounded-3xl px-6 py-5 text-sm leading-7 shadow-[0_12px_40px_rgba(0,0,0,0.18)]",
            isUser
            ? "ml-auto max-w-[52%] bg-emerald-300 text-zinc-950"
            : "mr-auto max-w-[76%] border border-white/[0.08] bg-white/[0.06] text-zinc-100",
        ].join(" ")}
    >
      {isUser ? (
        <p className="whitespace-pre-wrap">{message.content}</p>
      ) : (
        <MarkdownMessage content={message.content} />
      )}
    </div>
  );
}

type MarkdownMessageProps = {
  content: string;
};

function MarkdownMessage({ content }: MarkdownMessageProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="mb-4 border-b border-white/[0.10] pb-3 text-xl font-bold leading-tight text-zinc-50">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-3 mt-5 border-b border-white/[0.08] pb-2 text-lg font-bold leading-tight text-zinc-50 first:mt-0">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-2 mt-5 text-base font-semibold leading-tight text-zinc-100 first:mt-0">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="mb-3 leading-7 text-zinc-200 last:mb-0">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="mb-4 space-y-2 pl-1 text-zinc-200">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-4 list-decimal space-y-4 pl-5 text-zinc-200">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="leading-7 marker:text-emerald-300">
            {children}
          </li>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-zinc-50">{children}</strong>
        ),
        hr: () => <hr className="my-4 border-white/[0.10]" />,
        blockquote: ({ children }) => (
          <blockquote className="my-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.06] px-4 py-3 text-zinc-200">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="rounded-md bg-black/30 px-1.5 py-0.5 text-xs text-emerald-200">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="my-4 overflow-x-auto rounded-2xl border border-white/[0.08] bg-black/30 p-4 text-xs text-zinc-100">
            {children}
          </pre>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}