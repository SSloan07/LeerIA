import { useState } from "react";

import type { SidebarSubject } from "../types";

export function useSubjectPanel(subjects: SidebarSubject[]) {
  const [panelMode, setPanelMode] = useState<"create" | "edit" | null>(null);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);

  const editingSubject = subjects.find(
    (subject) => subject.id === editingSubjectId
  );

  function handleOpenCreateSubject() {
    setEditingSubjectId(null);
    setPanelMode("create");
  }

  function handleOpenEditSubject(subjectId: string) {
    setEditingSubjectId(subjectId);
    setPanelMode("edit");
  }

  function handleCloseSubjectPanel() {
    setPanelMode(null);
    setEditingSubjectId(null);
  }

  return {
    panelMode,
    editingSubjectId,
    editingSubject,
    handleOpenCreateSubject,
    handleOpenEditSubject,
    handleCloseSubjectPanel,
  };
}