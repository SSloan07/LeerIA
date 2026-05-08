import { useState } from "react";
import { Mic, Paperclip, Send } from "lucide-react";

type ChatComposerProps = {
  disabled?: boolean;
  isSubmitting?: boolean;
  onSubmitMessage: (message: string) => void | Promise<void>;
};

export function ChatComposer({
  disabled = false,
  isSubmitting = false,
  onSubmitMessage,
}: ChatComposerProps) {
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    const cleanMessage = message.trim();

    if (!cleanMessage || disabled || isSubmitting) {
      return;
    }

    await onSubmitMessage(cleanMessage);
    setMessage("");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 rounded-[1.5rem] border border-white/[0.1] bg-[#0B111A]/80 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <button
          type="button"
          aria-label="Adjuntar documento"
          disabled={disabled || isSubmitting}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-zinc-400 transition hover:bg-white/[0.06] hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSubmitting}
          placeholder={
            disabled
              ? "Selecciona una materia para preguntar..."
              : "Pregúntale algo a tu documento..."
          }
          className="h-12 min-w-0 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600 disabled:cursor-not-allowed"
        />

        <button
          type="button"
          aria-label="Enviar mensaje"
          onClick={handleSubmit}
          disabled={disabled || isSubmitting || !message.trim()}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-300 text-zinc-950 shadow-[0_0_28px_rgba(110,231,183,0.28)] transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-950/30 border-t-zinc-950" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-zinc-600">
        La IA puede cometer errores. Verifica la información importante.
      </p>
    </div>
  );
}