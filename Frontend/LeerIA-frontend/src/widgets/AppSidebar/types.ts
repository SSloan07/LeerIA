import type { Subject } from "../../shared/data/mock-data";
import type { Conversation } from "../../shared/api/conversations";

export type MaybePromise = void | Promise<void>;

export type AppSidebarProps = {
  subjects: Subject[];
  selectedSubjectId?: string | null;
  selectedConversationId?: string | null;
  conversationsBySubject: Record<string, Conversation[]>;
  loadingConversationsSubjectId?: string | null;
  onSelectSubject: (subjectId: string) => MaybePromise;
  onSelectConversation: (conversationId: string) => MaybePromise;
  onCreateConversation: (subjectId: string) => MaybePromise;
  onCreateSubject: () => void;
  onEditSubject: (subjectId: string) => void;
};

export type SubjectCardProps = {
  subject: Subject;
  selected: boolean;
  conversations: Conversation[];
  selectedConversationId?: string | null;
  loadingConversations: boolean;
  onClick: () => void;
  onEdit: () => void;
  onSelectConversation: (conversationId: string) => MaybePromise;
  onCreateConversation: () => MaybePromise;
};

export type ConversationListProps = {
  conversations: Conversation[];
  selectedConversationId?: string | null;
  loadingConversations: boolean;
  onSelectConversation: (conversationId: string) => MaybePromise;
  onCreateConversation: () => MaybePromise;
};

export type ConversationRowProps = {
  conversation: Conversation;
  selected: boolean;
  onClick: () => void;
};