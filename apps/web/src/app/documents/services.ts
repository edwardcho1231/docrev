import {
  type CreateDocumentPayload,
  type DocumentsResponse,
  type Document,
  type RevisionsResponse,
  type UpdateDocumentPayload,
} from "./types";

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

async function requestWithApi<T>(input: string, init: RequestInit): Promise<T> {
  const response = await fetch(`/api/v1/${input}`, {
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
  const payload = await requestWithApi<DocumentsResponse>("documents", {
    method: "GET",
  });

  return payload.documents;
}

export async function createDocument(payload: CreateDocumentPayload): Promise<Document> {
  return requestWithApi<Document>("documents", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateDocument(
  documentId: string,
  payload: UpdateDocumentPayload,
): Promise<Document> {
  return requestWithApi<Document>(`documents/${encodeURIComponent(documentId)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteDocument(documentId: string): Promise<void> {
  return requestWithApi<void>(`documents/${encodeURIComponent(documentId)}`, {
    method: "DELETE",
  });
}

export async function fetchDocumentRevisions(documentId: string): Promise<RevisionsResponse["revisions"]> {
  const payload = await requestWithApi<RevisionsResponse>(
    `revisions?documentId=${encodeURIComponent(documentId)}`,
    {
      method: "GET",
    },
  );

  return payload.revisions;
}
