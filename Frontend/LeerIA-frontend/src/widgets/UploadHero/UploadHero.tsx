import { Lock, UploadCloud } from "lucide-react";

import {
  quickActions,
  studyMetrics,
} from "../../shared/data/mock-data";

export function UploadHero() {
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
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-300 px-5 py-3 text-sm font-semibold text-zinc-950 shadow-[0_18px_45px_rgba(110,231,183,0.24)] transition hover:bg-emerald-200"
        >
          <UploadCloud className="h-4 w-4" />
          Subir archivo
        </button>

        <div className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-zinc-400">
          <Lock className="h-4 w-4 text-emerald-300" />
          Tus archivos son privados y seguros
        </div>
      </div>

      <div className="mt-7 flex flex-wrap justify-center gap-2">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-300/25 hover:bg-emerald-300/10 hover:text-emerald-100"
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
            Lo que la IA puede generar
          </h3>

          <span className="text-xs text-zinc-500">Vista previa</span>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {studyMetrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <article
                key={metric.id}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={[
                      "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                      metric.iconClassName,
                    ].join(" ")}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-3xl font-semibold tracking-tight text-zinc-50">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-sm font-medium text-zinc-200">
                      {metric.label}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {metric.description}
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