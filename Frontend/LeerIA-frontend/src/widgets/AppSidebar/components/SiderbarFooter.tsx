import { ChevronDown, ChevronRight, Settings } from "lucide-react";

import { appConfig } from "../../../shared/data/mock-data";

export function SidebarFooter() {
  return (
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
  );
}