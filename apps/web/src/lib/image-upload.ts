export const ALLOWED_IMAGE_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
export const IMAGE_UPLOAD_HANDLE_URL = "/api/v1/images/upload";

function readImageUploadEnvironmentPrefix(): string {
  return process.env.NODE_ENV === "development" ? "dev" : "";
}

function stripExtension(value: string): string {
  const extensionIndex = value.lastIndexOf(".");

  if (extensionIndex <= 0) {
    return value;
  }

  return value.slice(0, extensionIndex);
}

function readExtension(value: string): string {
  const extensionIndex = value.lastIndexOf(".");

  if (extensionIndex <= 0 || extensionIndex === value.length - 1) {
    return "";
  }

  return value.slice(extensionIndex + 1).toLowerCase();
}

export function sanitizeImageFilename(value: string): string {
  const baseName = stripExtension(value)
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const extension = readExtension(value).replace(/[^a-z0-9]/g, "");
  const safeBaseName = baseName || "image";

  return extension ? `${safeBaseName}.${extension}` : safeBaseName;
}

export function buildImageUploadDirectory(documentId: string): string {
  const environmentPrefix = readImageUploadEnvironmentPrefix();

  return environmentPrefix
    ? `${environmentPrefix}/documents/${documentId}`
    : `documents/${documentId}`;
}

export function buildImageUploadPath(documentId: string, filename: string): string {
  return `${buildImageUploadDirectory(documentId)}/${sanitizeImageFilename(filename)}`;
}
