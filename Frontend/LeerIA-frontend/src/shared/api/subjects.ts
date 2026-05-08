export type ApiSubject = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

type SubjectsResponse = {
  message: string;
  data: ApiSubject[];
};

type SubjectResponse = {
  message: string;
  data: ApiSubject | ApiSubject[];
};

export type SubjectPayload = {
  name: string;
  description?: string | null;
};

const API_URL = import.meta.env.VITE_API_URL;

export async function getSubjects(): Promise<ApiSubject[]> {
  const response = await fetch(`${API_URL}/subjects/`);

  if (!response.ok) {
    throw new Error("Error al cargar materias");
  }

  const result: SubjectsResponse = await response.json();

  return result.data;
}

export async function createSubject(
  payload: SubjectPayload
): Promise<ApiSubject> {
  const response = await fetch(`${API_URL}/subjects/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Error al crear materia");
  }

  const result: SubjectResponse = await response.json();

  return Array.isArray(result.data) ? result.data[0] : result.data;
}

export async function updateSubject(
  subjectId: string,
  payload: Partial<SubjectPayload>
): Promise<ApiSubject> {
  const response = await fetch(`${API_URL}/subjects/${subjectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar materia");
  }

  const result: SubjectResponse = await response.json();

  return Array.isArray(result.data) ? result.data[0] : result.data;
}