import { Bell, FileText, Search } from "lucide-react";

import {
  detectedTopics,
  recentFiles,
} from "../../shared/data/mock-data";

export function RightInspector() {
  return (
    <aside className="flex min-h-0 flex-col gap-4 rounded-[2rem] border border-white/[0.08] bg-white/[0.045] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-100">
            Panel de estudio
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Fuentes, temas y actividad
          </p>
        </div>

        <div className="flex items-center gap-2">
          <IconButton label="Buscar">
            <Search className="h-4 w-4" />
          </IconButton>

          <IconButton label="Notificaciones">
            <span className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-300" />
            </span>
          </IconButton>
        </div>
      </header>

      <section className="rounded-[1.6rem] border border-white/[0.08] bg-white/[0.035] p-4">
        <SectionTitle title="Fuentes recientes" action="Ver todo" />

        <div className="mt-3">
          {recentFiles.map((file) => (
            <RecentFileItem key={file.id} file={file} />
          ))}
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-white/[0.08] bg-white/[0.035] p-4">
        <SectionTitle title="Temas detectados" action="Ver todos" />

        <div className="mt-4 space-y-3">
          {detectedTopics.map((topic) => (
            <div key={topic} className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />
              <p className="text-sm leading-5 text-zinc-300">{topic}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-auto rounded-[1.6rem] border border-emerald-300/15 bg-emerald-300/[0.06] p-4">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-300/15 text-emerald-200">
            <FileText className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-100">
              Modo estudio listo
            </p>
            <p className="mt-1 text-sm leading-6 text-zinc-400">
              Sube un documento para activar preguntas, resúmenes, flashcards y
              video educativo.
            </p>
          </div>
        </div>
      </section>
    </aside>
  );
}

type IconButtonProps = {
  label: string;
  children: React.ReactNode;
};

function IconButton({ label, children }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.08] hover:text-zinc-100"
    >
      {children}
    </button>
  );
}

type SectionTitleProps = {
  title: string;
  action: string;
};

function SectionTitle({ title, action }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>

      <button
        type="button"
        className="text-xs font-medium text-emerald-300 transition hover:text-emerald-200"
      >
        {action}
      </button>
    </div>
  );
}

type RecentFileItemProps = {
  file: {
    name: string;
    type: string;
    size: string;
    date: string;
    badge: string;
    badgeClassName: string;
  };
};

function RecentFileItem({ file }: RecentFileItemProps) {
  return (
    <article className="flex items-center gap-3 border-b border-white/[0.06] py-3 last:border-0 last:pb-0">
      <div
        className={[
          "grid h-10 w-10 shrink-0 place-items-center rounded-xl border text-[10px] font-bold",
          file.badgeClassName,
        ].join(" ")}
      >
        {file.badge}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-100">
          {file.name}
        </p>

        <p className="mt-1 text-xs text-zinc-500">
          {file.type}
          <span className="mx-1">•</span>
          {file.size}
          <span className="mx-1">•</span>
          {file.date}
        </p>
      </div>
    </article>
  );
}