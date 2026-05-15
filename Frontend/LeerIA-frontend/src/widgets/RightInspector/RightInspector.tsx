import type { ReactNode } from "react";
import {
  Bell,
  BookOpenCheck,
  FileText,
  HelpCircle,
  Layers3,
  Search,
  Sparkles,
  Video,
  type LucideIcon,
} from "lucide-react";

import type { ApiDocument } from "../../shared/api/documents";
import type { GeneratedItemType } from "../../shared/api/generatedItems";

type RightInspectorProps = {
  documents: ApiDocument[];
  isLoadingDocuments?: boolean;
  selectedSubjectId?: string | null;
  activeStudyType?: GeneratedItemType | "chat" | null;
  isGeneratingStudyItem?: boolean;
  onGenerateStudyItem?: (type: GeneratedItemType) => void | Promise<void>;
};

type StudyAction = {
  type: GeneratedItemType;
  title: string;
  description: string;
  icon: LucideIcon;
};

const studyActions: StudyAction[] = [
  {
    type: "summary",
    title: "Resumen",
    description: "Genera una síntesis clara de los documentos.",
    icon: BookOpenCheck,
  },
  {
    type: "quiz",
    title: "Crear quiz",
    description: "Crea preguntas para comprobar comprensión.",
    icon: HelpCircle,
  },
  {
    type: "flashcards",
    title: "Flashcards",
    description: "Convierte conceptos en tarjetas de estudio.",
    icon: Layers3,
  },
  {
    type: "video_script",
    title: "Guion de video",
    description: "Genera un guion educativo desde la materia.",
    icon: Video,
  },
];

export function RightInspector({
  documents,
  isLoadingDocuments = false,
  selectedSubjectId = null,
  activeStudyType = null,
  isGeneratingStudyItem = false,
  onGenerateStudyItem,
}: RightInspectorProps) {
  const readyDocuments = documents.filter(
    (document) => document.status === "ready"
  );

  const hasReadyDocuments = readyDocuments.length > 0;

  const actionsDisabled =
    !selectedSubjectId || !hasReadyDocuments || isGeneratingStudyItem;

  return (
    <aside className="flex min-h-0 flex-col gap-4 rounded-[2rem] border border-white/[0.08] bg-white/[0.045] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-100">
            Panel de estudio
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Herramientas, fuentes y actividad
          </p>
        </div>

      
      </header>

      <section className="rounded-[1.6rem] border border-emerald-300/15 bg-emerald-300/[0.055] p-4">
        <SectionTitle title="Herramientas de estudio" />

        <div className="mt-4 grid gap-2">
          {studyActions.map((action) => (
            <StudyActionCard
              key={action.type}
              action={action}
              active={activeStudyType === action.type}
              disabled={actionsDisabled}
              loading={isGeneratingStudyItem && activeStudyType === action.type}
              onClick={() => onGenerateStudyItem?.(action.type)}
            />
          ))}
        </div>

        {!selectedSubjectId && (
          <p className="mt-3 text-xs leading-5 text-zinc-500">
            Selecciona una materia para activar las herramientas.
          </p>
        )}

        {selectedSubjectId && !hasReadyDocuments && (
          <p className="mt-3 text-xs leading-5 text-zinc-500">
            Sube y procesa al menos un documento para generar material de
            estudio.
          </p>
        )}
      </section>

      <section className="rounded-[1.6rem] border border-white/[0.08] bg-white/[0.035] p-4">
        <SectionTitle title="Fuentes recientes" />

        <div className="documents-scroll mt-3 max-h-[210px] overflow-y-auto pr-2">
          {isLoadingDocuments ? (
            <p className="py-4 text-sm text-zinc-500">
              Cargando documentos...
            </p>
          ) : documents.length === 0 ? (
            <p className="py-4 text-sm leading-6 text-zinc-500">
              Todavía no hay documentos en esta materia.
            </p>
          ) : (
            documents.map((document) => (
              <RecentDocumentItem key={document.id} document={document} />
            ))
          )}
        </div>
      </section>

      <section className="mt-auto rounded-[1.6rem] border border-white/[0.08] bg-white/[0.035] p-4">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-300/15 text-emerald-200">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-100">
              Estado de estudio
            </p>

            <p className="mt-1 text-sm leading-6 text-zinc-400">
              {hasReadyDocuments
                ? `${readyDocuments.length} documento${
                    readyDocuments.length === 1 ? "" : "s"
                  } listo${
                    readyDocuments.length === 1 ? "" : "s"
                  } para generar resúmenes, quizzes y flashcards.`
                : "Sube un documento para activar las herramientas de estudio."}
            </p>
          </div>
        </div>
      </section>
    </aside>
  );
}

type StudyActionCardProps = {
  action: StudyAction;
  active: boolean;
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
};

function StudyActionCard({
  action,
  active,
  disabled,
  loading,
  onClick,
}: StudyActionCardProps) {
  const Icon = action.icon;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "group flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition",
        active
          ? "border-emerald-300/35 bg-emerald-300/[0.10] text-zinc-50"
          : "border-white/[0.07] bg-white/[0.035] text-zinc-300 hover:border-white/[0.14] hover:bg-white/[0.06]",
        disabled ? "cursor-not-allowed opacity-50 hover:bg-white/[0.035]" : "",
      ].join(" ")}
    >
      <div
        className={[
          "grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition",
          active
            ? "border-emerald-300/30 bg-emerald-300/15 text-emerald-200"
            : "border-white/[0.08] bg-black/10 text-zinc-400 group-hover:text-emerald-200",
        ].join(" ")}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-zinc-100">
          {loading ? "Generando..." : action.title}
        </p>

        <p className="mt-1 text-xs leading-5 text-zinc-500">
          {action.description}
        </p>
      </div>
    </button>
  );
}

type IconButtonProps = {
  label: string;
  children: ReactNode;
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
  action?: string;
};

function SectionTitle({ title, action }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>

      {action && (
        <button
          type="button"
          className="text-xs font-medium text-emerald-300 transition hover:text-emerald-200"
        >
          {action}
        </button>
      )}
    </div>
  );
}

type RecentDocumentItemProps = {
  document: ApiDocument;
};

function RecentDocumentItem({ document }: RecentDocumentItemProps) {
  const extension = getDocumentExtension(document.file_name);
  const badgeClassName = getBadgeClassName(extension);
  const readableDate = formatDocumentDate(document.created_at);

  return (
    <article className="flex items-center gap-3 border-b border-white/[0.06] py-3 last:border-0 last:pb-0">
      <div
        className={[
          "grid h-10 w-10 shrink-0 place-items-center rounded-xl border text-[10px] font-bold",
          badgeClassName,
        ].join(" ")}
      >
        {extension.toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-100">
          {document.file_name}
        </p>

        <p className="mt-1 text-xs text-zinc-500">
          {extension.toUpperCase()}
          <span className="mx-1">•</span>
          {translateStatus(document.status)}
          <span className="mx-1">•</span>
          {readableDate}
        </p>
      </div>
    </article>
  );
}

function getDocumentExtension(fileName: string): string {
  const extension = fileName.split(".").pop();

  return extension ? extension.toLowerCase() : "file";
}

function translateStatus(status: ApiDocument["status"]): string {
  const statusMap: Record<ApiDocument["status"], string> = {
    uploaded: "Subido",
    processing: "Procesando",
    ready: "Listo",
    failed: "Error",
  };

  return statusMap[status] ?? status;
}

function formatDocumentDate(createdAt: string): string {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

function getBadgeClassName(extension: string): string {
  if (extension === "pdf") {
    return "border-red-400/20 bg-red-400/15 text-red-300";
  }

  if (extension === "docx" || extension === "doc") {
    return "border-blue-400/20 bg-blue-400/15 text-blue-300";
  }

  if (extension === "pptx" || extension === "ppt") {
    return "border-orange-400/20 bg-orange-400/15 text-orange-300";
  }

  if (extension === "xlsx" || extension === "xls") {
    return "border-emerald-400/20 bg-emerald-400/15 text-emerald-300";
  }

  if (extension === "txt") {
    return "border-zinc-400/20 bg-zinc-400/15 text-zinc-300";
  }

  return "border-violet-400/20 bg-violet-400/15 text-violet-300";
}