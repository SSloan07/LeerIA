import type { ReactNode } from "react";
import { Bell, FileText, Search } from "lucide-react";

import type { ApiDocument } from "../../shared/api/documents";

import { detectedTopics } from "../../shared/data/mock-data";

type RightInspectorProps = {
  documents: ApiDocument[];
  isLoadingDocuments?: boolean;
};

export function RightInspector({
  documents,
  isLoadingDocuments = false,
}: RightInspectorProps) {
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
        <SectionTitle title="Fuentes recientes" action="" />

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