import "server-only";
import { prisma } from "@repo/db";
import { getPublisherUserIds } from "./publisher-auth";
import { type DocumentKind, type PublishedDocumentRecord } from "@/types/documents";

export async function getPublishedDocuments(kind: DocumentKind): Promise<PublishedDocumentRecord[]> {
  const publisherUserIds = getPublisherUserIds();

  if (publisherUserIds.length === 0) {
    return [];
  }

  return prisma.document.findMany({
    where: {
      ownerId: { in: publisherUserIds },
      status: "PUBLISHED",
      kind,
      slug: { not: null },
      latestRevisionId: { not: null },
    },
    include: { latestRevision: true },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
  });
}

export async function getPublishedDocumentBySlug(
  kind: DocumentKind,
  slug: string,
): Promise<PublishedDocumentRecord | null> {
  const publisherUserIds = getPublisherUserIds();

  if (publisherUserIds.length === 0) {
    return null;
  }

  return prisma.document.findFirst({
    where: {
      ownerId: { in: publisherUserIds },
      status: "PUBLISHED",
      kind,
      slug,
      latestRevisionId: { not: null },
    },
    include: { latestRevision: true },
  });
}
