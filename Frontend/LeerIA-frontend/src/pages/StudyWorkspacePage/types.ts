import type { Subject } from "../../shared/data/mock-data";

export type SidebarSubject = Subject & {
  description?: string | null;
};