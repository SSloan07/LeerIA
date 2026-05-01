import {
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  Plus,
  Settings,
  Sparkles,
} from "lucide-react";

import { appConfig, type Subject } from "../../shared/data/mock-data";

type AppSidebarProps = {
  subjects: Subject[];
  selectedSubjectId?: string;
  onSelectSubject: (subjectId: string) => void;
};

export function AppSidebar({
  subjects,
  selectedSubjectId,
  onSelectSubject,
}: AppSidebarProps) {
  return (
    <aside className="flex min-h-0 flex-col rounded-[2rem] border border-white/[0.08] bg-white/[0.045] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      <header className="flex items-center justify-between px-2 py-2">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-300 text-zinc-950 shadow-[0_0_30px_rgba(110,231,183,0.35)]">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-sm font-semibold tracking-tight text-zinc-50">
              {appConfig.name}
            </h1>
            <p className="text-xs text-zinc-500">AI Study Workspace</p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Contraer menú"
          className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.08] hover:text-zinc-100"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
      </header>

      <button
        type="button"
        className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-emerald-300 px-4 py-3 text-sm font-semibold text-zinc-950 shadow-[0_14px_34px_rgba(110,231,183,0.22)] transition hover:bg-emerald-200"
      >
        <Plus className="h-4 w-4" />
        Nueva sesión
      </button>

      <section className="mt-8 min-h-0 flex-1">
        <div className="mb-3 flex items-center justify-between px-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Tus materias
          </p>

          <button
            type="button"
            className="rounded-lg px-2 py-1 text-xs text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200"
          >
            Ver todo
          </button>
        </div>

        <div className="space-y-3">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              selected={subject.id === selectedSubjectId}
              onClick={() => onSelectSubject(subject.id)}
            />
          ))}
        </div>
      </section>

      <footer className="mt-6 border-t border-white/[0.08] pt-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3 text-left transition hover:bg-white/[0.06]"
        >
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-300 to-cyan-300 text-sm font-bold text-zinc-950">
            {appConfig.user.initials}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-100">
              {appConfig.user.name}
            </p>
            <p className="text-xs text-emerald-300">{appConfig.user.plan}</p>
          </div>

          <ChevronDown className="h-4 w-4 text-zinc-500" />
        </button>

        <button
          type="button"
          className="mt-3 flex w-full items-center justify-between rounded-2xl px-3 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.06] hover:text-zinc-100"
        >
          <span className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Ajustes
          </span>

          <ChevronRight className="h-4 w-4" />
        </button>
      </footer>
    </aside>
  );
}

type SubjectCardProps = {
  subject: Subject;
  selected: boolean;
  onClick: () => void;
};

function SubjectCard({ subject, selected, onClick }: SubjectCardProps) {
  const Icon = subject.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group w-full rounded-2xl border p-4 text-left transition duration-300",
        selected
          ? "border-emerald-300/45 bg-emerald-400/[0.08] shadow-[0_0_34px_rgba(52,211,153,0.16)]"
          : "border-white/[0.07] bg-white/[0.035] hover:border-white/[0.14] hover:bg-white/[0.06]",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div
          className={[
            "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
            subject.iconClassName,
          ].join(" ")}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-100">
            {subject.name}
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            {subject.documents} documentos
            {selected && (
              <>
                <span className="mx-1.5">•</span>
                <span className="text-emerald-300">{subject.status}</span>
              </>
            )}
          </p>
        </div>

        <ChevronRight
          className={[
            "h-5 w-5 transition",
            selected
              ? "text-emerald-200"
              : "text-zinc-600 group-hover:translate-x-0.5 group-hover:text-zinc-300",
          ].join(" ")}
        />
      </div>
    </button>
  );
}