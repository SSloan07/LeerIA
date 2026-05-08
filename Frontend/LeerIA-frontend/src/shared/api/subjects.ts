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

const API_URL = import.meta.env.VITE_API_URL;

export async function getSubjects(): Promise<ApiSubject[]> {
  const response = await fetch(`${API_URL}/subjects/`);

  if (!response.ok) {
    throw new Error("Error al cargar materias");
  }

  const result: SubjectsResponse = await response.json();

  return result.data;
}