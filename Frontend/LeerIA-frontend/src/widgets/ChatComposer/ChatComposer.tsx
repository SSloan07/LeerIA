import { useState } from "react";
import { Paperclip, Send } from "lucide-react";

type ChatComposerProps = {
  disabled?: boolean;
  isSubmitting?: boolean;
  isUploading?: boolean;
  onSubmitMessage: (message: string) => void | Promise<void>;
  onUploadFile?: (file: File) => void | Promise<void>;
};

export function ChatComposer({
  disabled = false,
  isSubmitting = false,
  isUploading = false,
  onSubmitMessage,
  onUploadFile,
}: ChatComposerProps) {
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    const cleanMessage = message.trim();

    if (!cleanMessage || disabled || isSubmitting || isUploading) {
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

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !onUploadFile) {
      return;
    }

    await onUploadFile(file);

    event.target.value = "";
  }

  return (
    <div>
      <div className="flex items-center gap-3 rounded-[1.5rem] border border-white/[0.1] bg-[#0B111A]/80 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <label
          aria-label="Adjuntar documento"
          className={[
            "grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-zinc-400 transition hover:bg-white/[0.06] hover:text-zinc-100",
            disabled || isSubmitting || isUploading
              ? "pointer-events-none cursor-not-allowed opacity-40"
              : "cursor-pointer",
          ].join(" ")}
        >
          <Paperclip className="h-5 w-5" />

          <input
            type="file"
            className="hidden"
            accept=".pdf,.docx,.pptx,.txt"
            disabled={disabled || isSubmitting || isUploading}
            onChange={handleFileChange}
          />
        </label>

        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSubmitting || isUploading}
          placeholder={
            disabled
              ? "Selecciona una materia para preguntar..."
              : isUploading
                ? "Procesando documento..."
                : "Pregúntale algo a tu documento..."
          }
          className="h-12 min-w-0 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600 disabled:cursor-not-allowed"
        />

        <button
          type="button"
          aria-label="Enviar mensaje"
          onClick={handleSubmit}
          disabled={disabled || isSubmitting || isUploading || !message.trim()}
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