import {
  BookOpenText,
  HelpCircle,
  Layers,
  Lock,
  UploadCloud,
} from "lucide-react";

import { quickActions } from "../../shared/data/mock-data";

type UploadHeroProps = {
  disabled?: boolean;
  isUploading?: boolean;
  statusMessage?: string | null;
  onUploadFile: (file: File) => void | Promise<void>;
};

const heroCapabilities = [
  {
    id: "summaries",
    icon: BookOpenText,
    title: "Resúmenes claros",
    description:
      "Convierte documentos extensos en ideas principales, secciones organizadas y explicaciones fáciles de repasar.",
    iconClassName:
      "border border-emerald-300/20 bg-emerald-300/10 text-emerald-300",
  },
  {
    id: "quizzes",
    icon: HelpCircle,
    title: "Quizzes de práctica",
    description:
      "Genera preguntas para comprobar comprensión, practicar antes de un examen y detectar conceptos débiles.",
    iconClassName:
      "border border-violet-300/20 bg-violet-300/10 text-violet-300",
  },
  {
    id: "flashcards",
    icon: Layers,
    title: "Flashcards activas",
    description:
      "Transforma conceptos clave en tarjetas de estudio para memorizar definiciones, fórmulas e ideas centrales.",
    iconClassName:
      "border border-amber-300/20 bg-amber-300/10 text-amber-300",
  },
];

export function UploadHero({
  disabled = false,
  isUploading = false,
  statusMessage = null,
  onUploadFile,
}: UploadHeroProps) {
  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    await onUploadFile(file);

    event.target.value = "";
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
      <UploadIllustration />

      <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />
        Tutor IA documental
      </p>

      <h2 className="max-w-2xl text-balance text-4xl font-semibold tracking-[-0.04em] text-zinc-50 md:text-5xl">
        Sube un documento
      </h2>

      <p className="mt-4 max-w-2xl text-balance text-base leading-7 text-zinc-400">
        Convierte tus apuntes en chat, quizzes, flashcards y video con IA.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <label
          className={[
            "inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-emerald-300 px-5 py-3 text-sm font-semibold text-zinc-950 shadow-[0_18px_45px_rgba(110,231,183,0.24)] transition hover:bg-emerald-200",
            disabled || isUploading
              ? "pointer-events-none cursor-not-allowed opacity-50"
              : "",
          ].join(" ")}
        >
          <UploadCloud className="h-4 w-4" />
          {isUploading ? "Procesando..." : "Subir archivo"}

          <input
            type="file"
            className="hidden"
            accept=".pdf,.docx,.pptx,.txt"
            disabled={disabled || isUploading}
            onChange={handleFileChange}
          />
        </label>

        <div className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-zinc-400">
          <Lock className="h-4 w-4 text-emerald-300" />
          Tus archivos son privados y seguros
        </div>
      </div>

      {statusMessage && (
        <p className="mt-5 max-w-xl rounded-2xl border border-white/[0.08] bg-white/[0.04] px-5 py-3 text-sm text-zinc-400">
          {statusMessage}
        </p>
      )}

      <div className="mt-7 flex flex-wrap justify-center gap-2">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              type="button"
              disabled={disabled || isUploading}
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-300/25 hover:bg-emerald-300/10 hover:text-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon className="h-4 w-4" />
              {action.label}
            </button>
          );
        })}
      </div>

      <section className="mt-10 w-full rounded-[1.75rem] border border-white/[0.08] bg-white/[0.035] p-5 text-left shadow-inner shadow-white/[0.02]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-100">
            Herramientas que puedes generar
          </h3>

          <span className="text-xs text-zinc-500">
            Vista promocional
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {heroCapabilities.map((capability) => {
            const Icon = capability.icon;

            return (
              <article
                key={capability.id}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4 transition hover:border-emerald-300/20 hover:bg-white/[0.05]"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={[
                      "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                      capability.iconClassName,
                    ].join(" ")}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-zinc-50">
                      {capability.title}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-zinc-500">
                      {capability.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function UploadIllustration() {
  return (
    <div className="relative mb-8 grid h-44 w-64 place-items-center">
      <div className="absolute bottom-6 h-16 w-44 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="absolute left-8 top-8 h-2 w-2 rounded-full bg-cyan-200/70 blur-[1px]" />
      <div className="absolute right-10 top-6 h-1.5 w-1.5 rounded-full bg-emerald-200/80 blur-[1px]" />
      <div className="absolute right-8 top-20 h-1 w-1 rounded-full bg-white/70" />

      <div className="relative h-32 w-44 rounded-[2rem] border border-white/[0.1] bg-gradient-to-br from-white/[0.12] to-white/[0.03] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="absolute -top-4 left-8 h-8 w-24 rounded-t-2xl border border-white/[0.1] bg-white/[0.08]" />

        <div className="grid h-full place-items-center rounded-[1.4rem] border border-emerald-300/20 bg-emerald-300/[0.06]">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-emerald-300 text-zinc-950 shadow-[0_0_38px_rgba(110,231,183,0.42)]">
            <UploadCloud className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}