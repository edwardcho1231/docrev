// API DTOs: JSON-safe shapes sent over HTTP between browser and /api/v1 routes.
export type DocumentRevisionDto = {
  id: string;
  revisionNumber: number;
  title: string;
  content: string;
  createdAt: string;
};

export type DocumentRevisionsResponseDto = {
  revisions: DocumentRevisionDto[];
};

export type DocumentKind = "BLOG" | "PROJECT";
export type DocumentStatus = "DRAFT" | "PUBLISHED";

export type DocumentDto = {
  id: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  kind: DocumentKind | null;
  status: DocumentStatus;
  slug: string | null;
  excerpt: string | null;
  publishedAt: string | null;
  latestRevision: DocumentRevisionDto | null;
};

export type DocumentsResponseDto = {
  userId: string;
  isPublisher: boolean;
  documents: DocumentDto[];
};

// Server records: Prisma-returned shapes used in server-only data access code.
export type PublishedDocumentRevisionRecord = Omit<DocumentRevisionDto, "createdAt"> & {
  createdAt: Date;
};

export type PublishedDocumentRecord = Omit<
  DocumentDto,
  "createdAt" | "updatedAt" | "publishedAt" | "latestRevision"
> & {
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  latestRevision: PublishedDocumentRevisionRecord | null;
};
