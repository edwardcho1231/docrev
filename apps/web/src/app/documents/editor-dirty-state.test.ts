import { describe, expect, it } from "vitest";
import { type DocumentDto } from "@/types/documents";
import {
  canPublishDocument,
  createEditorDraftState,
  getEditorDirtyState,
} from "./editor-dirty-state";

function createDocument(overrides: Partial<DocumentDto> = {}): DocumentDto {
  return {
    id: "doc-1",
    ownerId: "user-1",
    createdAt: "2026-04-01T10:00:00.000Z",
    updatedAt: "2026-04-01T10:00:00.000Z",
    kind: "BLOG",
    status: "DRAFT",
    slug: null,
    excerpt: null,
    publishedAt: null,
    latestRevision: {
      id: "rev-1",
      revisionNumber: 1,
      title: "Launch Post",
      content: "Published content",
      createdAt: "2026-04-01T10:00:00.000Z",
    },
    ...overrides,
  };
}

describe("editor dirty-state helpers", () => {
  it("treats an unchanged existing document as clean", () => {
    const document = createDocument();
    const baseline = createEditorDraftState(document);
    const draft = createEditorDraftState(document);

    expect(getEditorDirtyState(baseline, draft)).toMatchObject({
      isRevisionDirty: false,
      isPublishDirty: false,
      normalizedSlug: "launch-post",
      normalizedExcerpt: "",
    });
  });

  it("ignores whitespace-only revision changes after normalization", () => {
    const document = createDocument();
    const baseline = createEditorDraftState(document);

    expect(
      getEditorDirtyState(baseline, {
        ...baseline,
        title: "  Launch Post  ",
        content: "\nPublished content\n",
      }),
    ).toMatchObject({
      isRevisionDirty: false,
    });
  });

  it("marks title and content edits as revision-dirty", () => {
    const document = createDocument();
    const baseline = createEditorDraftState(document);

    expect(
      getEditorDirtyState(baseline, {
        ...baseline,
        title: "Launch Post v2",
        content: "Published content with new section",
      }),
    ).toMatchObject({
      isRevisionDirty: true,
    });
  });

  it("normalizes slug and excerpt before deciding publish dirty state", () => {
    const document = createDocument({
      slug: "launch-post",
      excerpt: "A short summary",
      status: "PUBLISHED",
    });
    const baseline = createEditorDraftState(document);

    expect(
      getEditorDirtyState(baseline, {
        ...baseline,
        slug: " Launch-Post ",
        excerpt: "  A short summary  ",
      }),
    ).toMatchObject({
      isPublishDirty: false,
    });
  });

  it("slugifies titles for new draft publish defaults", () => {
    const baseline = createEditorDraftState(
      createDocument({
        latestRevision: {
          id: "rev-1",
          revisionNumber: 1,
          title: "  My First Post!  ",
          content: "Published content",
          createdAt: "2026-04-01T10:00:00.000Z",
        },
      }),
    );

    expect(baseline.slug).toBe("my-first-post");
  });

  it("allows publish for drafts even when publish fields match the baseline", () => {
    const document = createDocument();
    const baseline = createEditorDraftState(document);
    const { isRevisionDirty, isPublishDirty, normalizedSlug, normalizedExcerpt } =
      getEditorDirtyState(baseline, baseline);

    expect(
      canPublishDocument({
        status: document.status,
        isEditing: true,
        isPublisher: true,
        isBusy: false,
        isRevisionDirty,
        isPublishDirty,
        normalizedSlug,
        normalizedExcerpt,
      }),
    ).toBe(true);
  });

  it("requires publish metadata changes for already-published documents", () => {
    const document = createDocument({
      slug: "launch-post",
      excerpt: "A short summary",
      status: "PUBLISHED",
    });
    const baseline = createEditorDraftState(document);
    const state = getEditorDirtyState(baseline, baseline);

    expect(
      canPublishDocument({
        status: document.status,
        isEditing: true,
        isPublisher: true,
        isBusy: false,
        isRevisionDirty: state.isRevisionDirty,
        isPublishDirty: state.isPublishDirty,
        normalizedSlug: state.normalizedSlug,
        normalizedExcerpt: state.normalizedExcerpt,
      }),
    ).toBe(false);
  });

  it("disables publish when revision content is dirty even if publish fields are valid", () => {
    const document = createDocument();
    const baseline = createEditorDraftState(document);
    const state = getEditorDirtyState(baseline, {
      ...baseline,
      content: "Published content\n\n![Alt text](https://blob.example/image.png)",
    });

    expect(state.isRevisionDirty).toBe(true);
    expect(
      canPublishDocument({
        status: document.status,
        isEditing: true,
        isPublisher: true,
        isBusy: false,
        isRevisionDirty: state.isRevisionDirty,
        isPublishDirty: state.isPublishDirty,
        normalizedSlug: state.normalizedSlug,
        normalizedExcerpt: state.normalizedExcerpt,
      }),
    ).toBe(false);
  });

});
