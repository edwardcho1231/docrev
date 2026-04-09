import {
  type DocumentDto,
  type DocumentKind,
} from "@/types/documents";

export const MAX_EXCERPT_LENGTH = 300;
export const MAX_SLUG_LENGTH = 120;
export const PUBLISH_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type EditorDraftState = {
  title: string;
  content: string;
  kind: DocumentKind;
  slug: string;
  excerpt: string;
};

function slugifyDocumentTitle(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function createEditorDraftState(
  document: DocumentDto | null,
): EditorDraftState {
  const title = document?.latestRevision?.title ?? "";

  return {
    title,
    content: document?.latestRevision?.content ?? "",
    kind: document?.kind ?? "BLOG",
    slug: document?.slug ?? slugifyDocumentTitle(title),
    excerpt: document?.excerpt ?? "",
  };
}

function normalizePublishState(
  draft: Pick<EditorDraftState, "kind" | "slug" | "excerpt">,
) {
  return {
    kind: draft.kind,
    slug: draft.slug.trim().toLowerCase(),
    excerpt: draft.excerpt.trim(),
  };
}

export function getEditorDirtyState(
  baseline: EditorDraftState,
  draft: EditorDraftState,
) {
  const normalizedBaselineTitle = baseline.title.trim();
  const normalizedBaselineContent = baseline.content.trim();
  const normalizedDraftTitle = draft.title.trim();
  const normalizedDraftContent = draft.content.trim();
  const normalizedBaselinePublish = normalizePublishState(baseline);
  const normalizedDraftPublish = normalizePublishState(draft);

  const isRevisionDirty =
    normalizedBaselineTitle !== normalizedDraftTitle ||
    normalizedBaselineContent !== normalizedDraftContent;
  const isPublishDirty =
    normalizedBaselinePublish.kind !== normalizedDraftPublish.kind ||
    normalizedBaselinePublish.slug !== normalizedDraftPublish.slug ||
    normalizedBaselinePublish.excerpt !== normalizedDraftPublish.excerpt;

  return {
    isRevisionDirty,
    isPublishDirty,
    normalizedSlug: normalizedDraftPublish.slug,
    normalizedExcerpt: normalizedDraftPublish.excerpt,
  };
}

type CanPublishDocumentOptions = {
  status: DocumentDto["status"];
  isEditing: boolean;
  isPublisher: boolean;
  isBusy: boolean;
  isRevisionDirty: boolean;
  isPublishDirty: boolean;
  normalizedSlug: string;
  normalizedExcerpt: string;
};

export function canPublishDocument({
  status,
  isEditing,
  isPublisher,
  isBusy,
  isRevisionDirty,
  isPublishDirty,
  normalizedSlug,
  normalizedExcerpt,
}: CanPublishDocumentOptions): boolean {
  if (
    !isEditing ||
    !isPublisher ||
    isBusy ||
    isRevisionDirty ||
    normalizedSlug.length === 0 ||
    normalizedSlug.length > MAX_SLUG_LENGTH ||
    !PUBLISH_SLUG_REGEX.test(normalizedSlug) ||
    normalizedExcerpt.length > MAX_EXCERPT_LENGTH
  ) {
    return false;
  }

  if (status === "PUBLISHED") {
    return isPublishDirty;
  }

  return true;
}
