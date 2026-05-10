export function EmptyConversationState() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="max-w-md rounded-3xl border border-white/[0.08] bg-white/[0.04] p-6 text-center">
        <p className="text-lg font-semibold text-zinc-100">
          Selecciona o crea una conversación
        </p>

        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Las conversaciones aparecen debajo de cada materia en el panel
          izquierdo.
        </p>
      </div>
    </div>
  );
}