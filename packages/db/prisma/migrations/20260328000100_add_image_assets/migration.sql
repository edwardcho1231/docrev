CREATE TABLE "ImageAsset" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "ownerId" TEXT NOT NULL,
    "documentId" TEXT,
    "blobUrl" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImageAsset_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ImageAsset_blobUrl_key" ON "ImageAsset"("blobUrl");
CREATE UNIQUE INDEX "ImageAsset_pathname_key" ON "ImageAsset"("pathname");
CREATE INDEX "ImageAsset_ownerId_createdAt_idx" ON "ImageAsset"("ownerId", "createdAt");
CREATE INDEX "ImageAsset_documentId_createdAt_idx" ON "ImageAsset"("documentId", "createdAt");

ALTER TABLE "ImageAsset"
ADD CONSTRAINT "ImageAsset_documentId_fkey"
FOREIGN KEY ("documentId") REFERENCES "Document"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
