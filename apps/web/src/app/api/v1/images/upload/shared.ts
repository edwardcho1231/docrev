import { z } from "zod";
import { prisma } from "@repo/db";
import {
  ALLOWED_IMAGE_CONTENT_TYPES,
  buildImageUploadPath,
  MAX_IMAGE_SIZE_BYTES,
} from "@/lib/image-upload";

export const imageUploadClientPayloadSchema = z.object({
  documentId: z.uuid("A valid document ID is required"),
  filename: z.string().trim().min(1, "A filename is required").max(255),
  contentType: z.enum(ALLOWED_IMAGE_CONTENT_TYPES),
  sizeBytes: z.int().positive().max(MAX_IMAGE_SIZE_BYTES),
});

export type ImageUploadClientPayload = z.infer<typeof imageUploadClientPayloadSchema>;

type PersistImageAssetInput = {
  ownerId: string;
  documentId: string;
  url: string;
  pathname: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
};

export function parseImageUploadClientPayload(rawPayload: string | null): ImageUploadClientPayload {
  if (!rawPayload) {
    throw new Error("Missing upload payload");
  }

  let parsedPayload: unknown;

  try {
    parsedPayload = JSON.parse(rawPayload);
  } catch {
    throw new Error("Invalid upload payload");
  }

  const parsed = imageUploadClientPayloadSchema.safeParse(parsedPayload);

  if (!parsed.success) {
    throw new Error("Invalid upload payload");
  }

  return parsed.data;
}

export function buildExpectedImagePathname(documentId: string, filename: string): string {
  return buildImageUploadPath(documentId, filename);
}

export async function persistImageAssetRecord({
  ownerId,
  documentId,
  url,
  pathname,
  filename,
  contentType,
  sizeBytes,
}: PersistImageAssetInput) {
  const document = await prisma.document.findFirst({
    where: {
      id: documentId,
      ownerId,
    },
    select: { id: true },
  });

  await prisma.imageAsset.upsert({
    where: { pathname },
    create: {
      ownerId,
      documentId: document?.id ?? null,
      blobUrl: url,
      pathname,
      filename,
      contentType,
      sizeBytes,
    },
    update: {
      ownerId,
      documentId: document?.id ?? null,
      blobUrl: url,
      filename,
      contentType,
      sizeBytes,
    },
  });
}
