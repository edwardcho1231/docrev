const PUBLISHER_CLERK_USER_IDS_ENV = "PUBLISHER_CLERK_USER_IDS";

function parsePublisherUserIds(raw: string | undefined): string[] {
  if (!raw) {
    return [];
  }

  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

export function getPublisherUserIds(): string[] {
  return parsePublisherUserIds(process.env[PUBLISHER_CLERK_USER_IDS_ENV]);
}

export function isPublisher(userId: string | null | undefined): boolean {
  if (!userId) {
    return false;
  }

  const allowlist = getPublisherUserIds();
  return allowlist.includes(userId);
}
