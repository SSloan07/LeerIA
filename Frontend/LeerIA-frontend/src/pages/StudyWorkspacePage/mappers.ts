import { BookOpen } from "lucide-react";

import type { ApiSubject } from "../../shared/api/subjects";
import type { SidebarSubject } from "./types";

export function mapApiSubjectToSidebarSubject(
  subject: ApiSubject
): SidebarSubject {
  return {
    id: subject.id,
    name: subject.name,
    description: subject.description,
    documents: 0,
    status: "Activa",
    icon: BookOpen,
    iconClassName: "bg-emerald-400/15 text-emerald-300",
  };
}