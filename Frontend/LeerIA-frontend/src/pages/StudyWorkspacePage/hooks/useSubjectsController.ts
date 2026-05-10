import { useState } from "react";

import {
  createSubject,
  getSubjects,
  updateSubject,
} from "../../../shared/api/subjects";

import { mapApiSubjectToSidebarSubject } from "../mappers";
import type { SidebarSubject } from "../types";

export function useSubjectsController() {
  const [subjects, setSubjects] = useState<SidebarSubject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  );
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);

  async function loadSubjects() {
    const apiSubjects = await getSubjects();
    const sidebarSubjects = apiSubjects.map(mapApiSubjectToSidebarSubject);

    setSubjects(sidebarSubjects);

    return sidebarSubjects;
  }

  async function createNewSubject(data: {
    name: string;
    description?: string | null;
  }) {
    const createdSubject = await createSubject(data);
    const sidebarSubject = mapApiSubjectToSidebarSubject(createdSubject);

    setSubjects((currentSubjects) => [...currentSubjects, sidebarSubject]);

    return sidebarSubject;
  }

  async function updateExistingSubject(
    subjectId: string,
    data: {
      name: string;
      description?: string | null;
    }
  ) {
    const updatedSubject = await updateSubject(subjectId, data);
    const sidebarSubject = mapApiSubjectToSidebarSubject(updatedSubject);

    setSubjects((currentSubjects) =>
      currentSubjects.map((subject) =>
        subject.id === updatedSubject.id
          ? {
              ...sidebarSubject,
              documents: subject.documents,
            }
          : subject
      )
    );

    return sidebarSubject;
  }

  function updateSubjectDocumentCount(subjectId: string, documentCount: number) {
    setSubjects((currentSubjects) =>
      currentSubjects.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              documents: documentCount,
            }
          : subject
      )
    );
  }

  return {
    subjects,
    setSubjects,
    selectedSubjectId,
    setSelectedSubjectId,
    isLoadingSubjects,
    setIsLoadingSubjects,
    loadSubjects,
    createNewSubject,
    updateExistingSubject,
    updateSubjectDocumentCount,
  };
}