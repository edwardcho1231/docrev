import {
  type CreateDocumentPayload,
  type DocumentsResponse,
  type Document,
  type UpdateDocumentPayload,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type ApiError = {
  error?: {
    message?: string;
  };
};

async function readJsonSafely(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

async function requestWithCredentials<T>(input: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}/api/v1/${input}`, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  const payload = await readJsonSafely(response);
  const message = (payload as ApiError).error?.message;

  if (!response.ok) {
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return payload as T;
}

export async function fetchDocuments(): Promise<Document[]> {
  const payload = await requestWithCredentials<DocumentsResponse>("documents", {
    method: "GET",
  });

  return payload.documents;
}

export async function createDocument(payload: CreateDocumentPayload): Promise<Document> {
  return requestWithCredentials<Document>("documents", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateDocument(
  documentId: string,
  payload: UpdateDocumentPayload,
): Promise<Document> {
  return requestWithCredentials<Document>(`documents/${encodeURIComponent(documentId)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteDocument(documentId: string): Promise<void> {
  return requestWithCredentials<void>(`documents/${encodeURIComponent(documentId)}`, {
    method: "DELETE",
  });
}
