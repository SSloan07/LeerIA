import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

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
      <MarkdownMessage content={message.content} isUser={isUser} />
    </div>
  );
}

type MarkdownMessageProps = {
  content: string;
  isUser: boolean;
};

function MarkdownMessage({ content, isUser }: MarkdownMessageProps) {
  const normalizedContent = normalizeLatexDelimiters(content);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        h1: ({ children }) => (
          <h1
            className={[
              "mb-4 border-b pb-3 text-xl font-bold leading-tight",
              isUser
                ? "border-zinc-900/10 text-zinc-950"
                : "border-white/[0.10] text-zinc-50",
            ].join(" ")}
          >
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2
            className={[
              "mb-3 mt-5 border-b pb-2 text-lg font-bold leading-tight first:mt-0",
              isUser
                ? "border-zinc-900/10 text-zinc-950"
                : "border-white/[0.08] text-zinc-50",
            ].join(" ")}
          >
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3
            className={[
              "mb-2 mt-5 text-base font-semibold leading-tight first:mt-0",
              isUser ? "text-zinc-950" : "text-zinc-100",
            ].join(" ")}
          >
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p
            className={[
              "mb-3 whitespace-pre-wrap leading-7 last:mb-0",
              isUser ? "text-zinc-950" : "text-zinc-200",
            ].join(" ")}
          >
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul
            className={[
              "mb-4 space-y-2 pl-1",
              isUser ? "text-zinc-950" : "text-zinc-200",
            ].join(" ")}
          >
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol
            className={[
              "mb-4 list-decimal space-y-4 pl-5",
              isUser ? "text-zinc-950" : "text-zinc-200",
            ].join(" ")}
          >
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li
            className={[
              "leading-7",
              isUser ? "marker:text-zinc-900" : "marker:text-emerald-300",
            ].join(" ")}
          >
            {children}
          </li>
        ),
        strong: ({ children }) => (
          <strong
            className={[
              "font-semibold",
              isUser ? "text-zinc-950" : "text-zinc-50",
            ].join(" ")}
          >
            {children}
          </strong>
        ),
        hr: () => (
          <hr
            className={[
              "my-4",
              isUser ? "border-zinc-900/10" : "border-white/[0.10]",
            ].join(" ")}
          />
        ),
        blockquote: ({ children }) => (
          <blockquote
            className={[
              "my-4 rounded-2xl border px-4 py-3",
              isUser
                ? "border-zinc-900/10 bg-zinc-950/5 text-zinc-950"
                : "border-emerald-300/20 bg-emerald-300/[0.06] text-zinc-200",
            ].join(" ")}
          >
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code
            className={[
              "rounded-md px-1.5 py-0.5 text-xs",
              isUser
                ? "bg-zinc-950/10 text-zinc-950"
                : "bg-black/30 text-emerald-200",
            ].join(" ")}
          >
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre
            className={[
              "my-4 overflow-x-auto rounded-2xl border p-4 text-xs",
              isUser
                ? "border-zinc-900/10 bg-zinc-950/10 text-zinc-950"
                : "border-white/[0.08] bg-black/30 text-zinc-100",
            ].join(" ")}
          >
            {children}
          </pre>
        ),
      }}
    >
      {normalizedContent}
    </ReactMarkdown>
  );
}

function normalizeLatexDelimiters(content: string) {
  return content
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => {
      return `\n$$${math.trim()}$$\n`;
    })
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => {
      return `$${math.trim()}$`;
    });
}