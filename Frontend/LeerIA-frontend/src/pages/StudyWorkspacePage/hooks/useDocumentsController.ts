import { useState } from "react";

import {
  uploadDocument,
  processDocument,
  getDocumentsBySubject,
  type ApiDocument,
} from "../../../shared/api/documents";

type UseDocumentsControllerParams = {
  onDocumentCountChange?: (subjectId: string, documentCount: number) => void;
};

export function useDocumentsController({
  onDocumentCountChange,
}: UseDocumentsControllerParams = {}) {
  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [uploadStatusMessage, setUploadStatusMessage] = useState<string | null>(
    null
  );

  async function loadDocumentsBySubject(subjectId: string) {
    setIsLoadingDocuments(true);

    try {
      const subjectDocuments = await getDocumentsBySubject(subjectId);

      setDocuments(subjectDocuments);
      onDocumentCountChange?.(subjectId, subjectDocuments.length);

      return subjectDocuments;
    } catch (error) {
      console.error("Error cargando documentos:", error);
      setDocuments([]);
      return [];
    } finally {
      setIsLoadingDocuments(false);
    }
  }

  async function uploadAndProcessDocument(subjectId: string, file: File) {
    setIsUploadingDocument(true);
    setUploadStatusMessage("Subiendo documento...");

    try {
      const uploadedDocument = await uploadDocument({
        subjectId,
        file,
      });

      setUploadStatusMessage(
        "Documento subido. Procesando texto, chunks y embeddings..."
      );

      const processedDocument = await processDocument(uploadedDocument.id);

      setUploadStatusMessage(
        `Documento procesado correctamente. Chunks creados: ${processedDocument.chunks_created}`
      );

      await loadDocumentsBySubject(subjectId);

      return processedDocument;
    } catch (error) {
      console.error("Error subiendo/procesando documento:", error);

      setUploadStatusMessage(
        error instanceof Error
          ? error.message
          : "No se pudo subir o procesar el documento."
      );

      throw error;
    } finally {
      setIsUploadingDocument(false);
    }
  }

  function clearDocuments() {
    setDocuments([]);
  }

  function clearUploadStatus() {
    setUploadStatusMessage(null);
  }

  return {
    documents,
    isLoadingDocuments,
    isUploadingDocument,
    uploadStatusMessage,
    setUploadStatusMessage,
    loadDocumentsBySubject,
    uploadAndProcessDocument,
    clearDocuments,
    clearUploadStatus,
  };
}