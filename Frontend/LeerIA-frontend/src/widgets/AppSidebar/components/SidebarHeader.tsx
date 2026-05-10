import { ChevronsLeft, Sparkles } from "lucide-react";

import { appConfig } from "../../../shared/data/mock-data";

export function SidebarHeader() {
  return (
    <header className="flex items-center justify-between px-2 py-2">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-300 text-zinc-950 shadow-[0_0_30px_rgba(110,231,183,0.35)]">
          <Sparkles className="h-5 w-5" />
        </div>

        <div>
          <h1 className="text-sm font-semibold tracking-tight text-zinc-50">
            {appConfig.name}
          </h1>
          <p className="text-xs text-zinc-500">LeerIA</p>
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
  );
}