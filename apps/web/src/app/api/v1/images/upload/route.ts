import { auth } from "@clerk/nextjs/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import {
  ALLOWED_IMAGE_CONTENT_TYPES,
  MAX_IMAGE_SIZE_BYTES,
} from "@/lib/image-upload";
import {
  buildExpectedImagePathname,
  parseImageUploadClientPayload,
} from "./shared";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
  let body: HandleUploadBody;

  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return buildErrorResponse("Invalid upload request");
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const { userId } = await auth();

        if (!userId) {
          throw new Error("Authentication required");
        }

        const parsedPayload = parseImageUploadClientPayload(clientPayload);
        const document = await prisma.document.findFirst({
          where: {
            id: parsedPayload.documentId,
            ownerId: userId,
          },
          select: { id: true },
        });

        if (!document) {
          throw new Error("Document not found");
        }

        const expectedPathname = buildExpectedImagePathname(
          parsedPayload.documentId,
          parsedPayload.filename,
        );

        if (pathname !== expectedPathname) {
          throw new Error("Invalid upload path");
        }

        return {
          addRandomSuffix: true,
          allowedContentTypes: [...ALLOWED_IMAGE_CONTENT_TYPES],
          maximumSizeInBytes: MAX_IMAGE_SIZE_BYTES,
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return buildErrorResponse(error.message, 401);
    }

    return buildErrorResponse(
      error instanceof Error ? error.message : "Unable to prepare image upload",
    );
  }
}
