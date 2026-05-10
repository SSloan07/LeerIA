import { BookOpenCheck, CheckCircle2, ListChecks } from "lucide-react";

import type {
  GeneratedItem,
  SummaryContent,
} from "../../../shared/api/generatedItems";

type SummaryViewerProps = {
  item: GeneratedItem;
  onBackToChat: () => void;
};

type SummarySection = {
  heading: string;
  body: string;
};

export function SummaryViewer({ item, onBackToChat }: SummaryViewerProps) {
  const summary = getSummaryFromItem(item);

  if (!summary) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="max-w-md rounded-3xl border border-white/[0.08] bg-white/[0.04] p-6 text-center">
          <p className="text-lg font-semibold text-zinc-100">
            No hay resumen disponible
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            No pude encontrar una estructura válida de resumen en el contenido
            generado.
          </p>

          <button
            type="button"
            onClick={onBackToChat}
            className="mt-5 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            Volver al chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
            Resumen
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
            {summary.title}
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
            Resumen generado con base en los documentos de esta materia.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToChat}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.08] hover:text-zinc-100"
        >
          Volver al chat
        </button>
      </div>

      <div className="summary-scroll min-h-0 flex-1 overflow-y-auto pr-2">
        <div className="grid gap-5">
          <section className="rounded-[2rem] border border-emerald-300/15 bg-emerald-300/[0.06] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-200">
                <BookOpenCheck className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-zinc-50">
                  Vista general
                </h3>

                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  {summary.overview}
                </p>
              </div>
            </div>
          </section>

          {summary.key_points.length > 0 && (
            <section className="rounded-[2rem] border border-white/[0.08] bg-white/[0.04] p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-black/10 text-emerald-200">
                  <ListChecks className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-zinc-50">
                    Ideas clave
                  </h3>
                  <p className="text-sm text-zinc-500">
                    Puntos principales para estudiar.
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                {summary.key_points.map((point, index) => (
                  <div
                    key={`${point}-${index}`}
                    className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />

                    <p className="text-sm leading-6 text-zinc-300">{point}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {summary.sections.length > 0 && (
            <section className="rounded-[2rem] border border-white/[0.08] bg-white/[0.04] p-6">
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-zinc-50">
                  Desarrollo por secciones
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Explicación organizada del contenido.
                </p>
              </div>

              <div className="space-y-4">
                {summary.sections.map((section, index) => (
                  <article
                    key={`${section.heading}-${index}`}
                    className="rounded-2xl border border-white/[0.06] bg-black/10 p-5"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-300 text-xs font-bold text-zinc-950">
                        {index + 1}
                      </span>

                      <h4 className="text-base font-semibold text-zinc-100">
                        {section.heading}
                      </h4>
                    </div>

                    <p className="text-sm leading-7 text-zinc-400">
                      {section.body}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

type NormalizedSummary = {
  title: string;
  overview: string;
  key_points: string[];
  sections: SummarySection[];
};

function getSummaryFromItem(item: GeneratedItem): NormalizedSummary | null {
  const content = item.content as SummaryContent;

  if (!content || typeof content !== "object") {
    return null;
  }

  const title =
    typeof content.title === "string" && content.title.trim()
      ? content.title
      : "Resumen generado";

  const overview =
    typeof content.overview === "string" && content.overview.trim()
      ? content.overview
      : "";

  const keyPoints = Array.isArray(content.key_points)
    ? content.key_points.filter(
        (point) => typeof point === "string" && point.trim() !== ""
      )
    : [];

  const sections = Array.isArray(content.sections)
    ? content.sections
        .filter((section) => {
          return (
            section &&
            typeof section.heading === "string" &&
            section.heading.trim() !== "" &&
            typeof section.body === "string" &&
            section.body.trim() !== ""
          );
        })
        .map((section) => ({
          heading: section.heading,
          body: section.body,
        }))
    : [];

  if (!overview && keyPoints.length === 0 && sections.length === 0) {
    return null;
  }

  return {
    title,
    overview,
    key_points: keyPoints,
    sections,
  };
}