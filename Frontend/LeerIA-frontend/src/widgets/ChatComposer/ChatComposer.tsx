import { Mic, Paperclip, Send } from "lucide-react";

export function ChatComposer() {
  return (
    <div>
      <div className="flex items-center gap-3 rounded-[1.5rem] border border-white/[0.1] bg-[#0B111A]/80 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <button
          type="button"
          aria-label="Adjuntar documento"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-zinc-400 transition hover:bg-white/[0.06] hover:text-zinc-100"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <input
          type="text"
          placeholder="Pregúntale algo a tu documento..."
          className="h-12 min-w-0 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
        />

        <button
          type="button"
          aria-label="Enviar mensaje"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-300 text-zinc-950 shadow-[0_0_28px_rgba(110,231,183,0.28)] transition hover:bg-emerald-200"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-zinc-600">
        La IA puede cometer errores. Verifica la información importante.
      </p>
    </div>
  );
}