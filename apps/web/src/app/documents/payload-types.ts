import { type DocumentKind } from "@/types/documents";

export type UpdateDocumentPayload = {
  title: string;
  content: string;
};

export type CreateDocumentPayload = {
  title: string;
  content: string;
};

export type PublishDocumentPayload = {
  kind: DocumentKind;
  slug: string;
  excerpt?: string;
};
