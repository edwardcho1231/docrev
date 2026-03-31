import { auth } from "@clerk/nextjs/server";
import { head } from "@vercel/blob";
import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { z } from "zod";
import { buildImageUploadDirectory } from "@/lib/image-upload";
import { persistImageAssetRecord } from "../upload/shared";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const registerImageSchema = z.object({
  documentId: z.uuid("A valid document ID is required"),
  url: z.url("A valid blob URL is required"),
  pathname: z.string().trim().min(1, "A blob pathname is required"),
  filename: z.string().trim().min(1, "A filename is required").max(255),
});

function buildErrorResponse(message: string, status = 400) {
  return NextResponse.json(
    {
      error: {
        message,
      },
    },
    { status },
  );
}

export async function POST(request: Request): Promise<NextResponse> {
  const { userId } = await auth();

  if (!userId) {
    return buildErrorResponse("Authentication required", 401);
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return buildErrorResponse("Invalid image registration payload");
  }

  const parsedPayload = registerImageSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return buildErrorResponse("Invalid image registration payload");
  }

  const { documentId, url, pathname, filename } = parsedPayload.data;
  const document = await prisma.document.findFirst({
    where: {
      id: documentId,
      ownerId: userId,
    },
    select: { id: true },
  });

  if (!document) {
    return buildErrorResponse("Document not found", 404);
  }

  if (!pathname.startsWith(`${buildImageUploadDirectory(documentId)}/`)) {
    return buildErrorResponse("Invalid image path");
  }

  try {
    const blob = await head(url);

    if (blob.pathname !== pathname) {
      return buildErrorResponse("Blob path mismatch");
    }

    await persistImageAssetRecord({
      ownerId: userId,
      documentId,
      url: blob.url,
      pathname: blob.pathname,
      filename,
      contentType: blob.contentType,
      sizeBytes: blob.size,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return buildErrorResponse(
      error instanceof Error ? error.message : "Unable to register image",
    );
  }
}
