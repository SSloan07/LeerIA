const API_URL = import.meta.env.VITE_API_URL;

export type ApiDocument = {
  id: string;
  subject_id: string;
  file_name: string;
  file_type: string | null;
  storage_path: string;
  status: "uploaded" | "processing" | "ready" | "failed";
  created_at: string;
};

type UploadDocumentResponse = {
  message: string;
  bucket: string;
  storage_path: string;
  document: ApiDocument;
};

type ProcessDocumentResponse = {
  message: string;
  data: {
    document: ApiDocument;
    chunks_created: number;
    status: "ready";
  };
};

export async function uploadDocument(params: {
  subjectId: string;
  file: File;
}): Promise<ApiDocument> {
  const formData = new FormData();

  formData.append("subject_id", params.subjectId);
  formData.append("file", params.file);

  const response = await fetch(`${API_URL}/documents/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Error al subir documento");
  }

  const result: UploadDocumentResponse = await response.json();

  return result.document;
}

export async function processDocument(
  documentId: string
): Promise<ProcessDocumentResponse["data"]> {
  const response = await fetch(`${API_URL}/documents/${documentId}/process`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Error al procesar documento");
  }

  const result: ProcessDocumentResponse = await response.json();

  return result.data;
}