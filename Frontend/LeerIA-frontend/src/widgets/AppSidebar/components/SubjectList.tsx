import type { AppSidebarProps } from "../types";
import { SubjectCard } from "./SubjectCard";

type SubjectListProps = Pick<
  AppSidebarProps,
  | "subjects"
  | "selectedSubjectId"
  | "selectedConversationId"
  | "conversationsBySubject"
  | "loadingConversationsSubjectId"
  | "onSelectSubject"
  | "onSelectConversation"
  | "onCreateConversation"
  | "onEditSubject"
>;

export function SubjectList({
  subjects,
  selectedSubjectId,
  selectedConversationId,
  conversationsBySubject,
  loadingConversationsSubjectId,
  onSelectSubject,
  onSelectConversation,
  onCreateConversation,
  onEditSubject,
}: SubjectListProps) {
  return (
    <section className="mt-8 flex min-h-0 flex-1 flex-col">
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

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {subjects.map((subject) => {
          const selected = subject.id === selectedSubjectId;
          const conversations = conversationsBySubject[subject.id] ?? [];
          const loading = loadingConversationsSubjectId === subject.id;

          return (
            <SubjectCard
              key={subject.id}
              subject={subject}
              selected={selected}
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              loadingConversations={loading}
              onClick={() => onSelectSubject(subject.id)}
              onEdit={() => onEditSubject(subject.id)}
              onSelectConversation={onSelectConversation}
              onCreateConversation={() => onCreateConversation(subject.id)}
            />
          );
        })}
      </div>
    </section>
  );
}