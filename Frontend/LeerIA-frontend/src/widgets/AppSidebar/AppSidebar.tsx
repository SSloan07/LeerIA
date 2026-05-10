import { Plus } from "lucide-react";

import type { AppSidebarProps } from "./types";
import { SidebarHeader } from "./components/SidebarHeader";
import { SidebarFooter} from "./components/SiderbarFooter"
import { SubjectList } from "./components/SubjectList";

export function AppSidebar({
  subjects,
  selectedSubjectId,
  selectedConversationId,
  conversationsBySubject,
  loadingConversationsSubjectId,
  onSelectSubject,
  onSelectConversation,
  onCreateConversation,
  onCreateSubject,
  onEditSubject,
}: AppSidebarProps) {
  return (
    <aside className="flex min-h-0 flex-col rounded-[2rem] border border-white/[0.08] bg-white/[0.045] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      <SidebarHeader />

      <button
        type="button"
        onClick={onCreateSubject}
        className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-emerald-300 px-4 py-3 text-sm font-semibold text-zinc-950 shadow-[0_14px_34px_rgba(110,231,183,0.22)] transition hover:bg-emerald-200"
      >
        <Plus className="h-4 w-4" />
        Nueva materia
      </button>

      <SubjectList
        subjects={subjects}
        selectedSubjectId={selectedSubjectId}
        selectedConversationId={selectedConversationId}
        conversationsBySubject={conversationsBySubject}
        loadingConversationsSubjectId={loadingConversationsSubjectId}
        onSelectSubject={onSelectSubject}
        onSelectConversation={onSelectConversation}
        onCreateConversation={onCreateConversation}
        onEditSubject={onEditSubject}
      />

      <SidebarFooter />
    </aside>
  );
}