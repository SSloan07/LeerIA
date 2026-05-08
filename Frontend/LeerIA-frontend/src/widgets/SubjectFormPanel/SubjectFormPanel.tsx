import { useEffect, useState } from "react";
import { X } from "lucide-react";

type SubjectFormPanelProps = {
  mode: "create" | "edit";
  initialName?: string;
  initialDescription?: string | null;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description?: string | null;
  }) => Promise<void>;
};

export function SubjectFormPanel({
  mode,
  initialName = "",
  initialDescription = "",
  onClose,
  onSubmit,
}: SubjectFormPanelProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription ?? "");
  }, [initialName, initialDescription]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || null,
      });

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="absolute left-[320px] top-8 z-50 w-[380px] rounded-3xl border border-white/[0.1] bg-[#11151D]/95 p-5 text-zinc-100 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-50">
            {mode === "create" ? "Nueva materia" : "Editar materia"}
          </h2>

          <p className="mt-1 text-xs text-zinc-500">
            {mode === "create"
              ? "Crea una materia para organizar documentos, chats y RAG."
              : "Actualiza el nombre o la descripción de esta materia."}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="grid h-8 w-8 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.08] hover:text-zinc-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-medium text-zinc-400">
            Nombre
          </label>

          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej: Cálculo 3"
            className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-zinc-400">
            Descripción
          </label>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Ej: Derivadas parciales, integrales múltiples y cálculo vectorial."
            rows={4}
            className="w-full resize-none rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/50"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !name.trim()}
          className="w-full rounded-2xl bg-emerald-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Guardando..."
            : mode === "create"
              ? "Crear materia"
              : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}