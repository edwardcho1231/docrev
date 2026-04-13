"use client";

import { type FormEvent, type RefObject, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ALLOWED_IMAGE_CONTENT_TYPES } from "@/lib/image-upload";
import { MarkdownPreview } from "./markdown-preview";

type DocumentEditorUIProps = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  title: string;
  content: string;
  isEditing: boolean;
  isBusy: boolean;
  isSubmitDisabled: boolean;
  canUploadImages: boolean;
  isUploadingImage: boolean;
  submitting: boolean;
  error: string | null;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onUploadImage: (file: File) => Promise<void>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancelEdit?: () => void;
  submitButtonText: string;
  submitBusyText: string;
  maxLength: number;
};

export function DocumentEditorUI({
  textareaRef,
  title,
  content,
  isEditing,
  isBusy,
  isSubmitDisabled,
  canUploadImages,
  isUploadingImage,
  submitting,
  error,
  onTitleChange,
  onContentChange,
  onUploadImage,
  onSubmit,
  onCancelEdit,
  submitButtonText,
  submitBusyText,
  maxLength,
}: DocumentEditorUIProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isContentTooLong = content.length > maxLength;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-md border border-[var(--app-border)] p-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              required
              maxLength={140}
              placeholder="Write a title for your document"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content">Content</Label>
            <Textarea
              ref={textareaRef}
              id="content"
              value={content}
              onChange={(event) => onContentChange(event.target.value)}
              required
              placeholder="Write markdown content."
              rows={16}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-[var(--app-muted)]">Character count</p>
            <p
              className={`text-xs ${isContentTooLong ? "text-red-400" : "text-[var(--app-muted)]"}`}
            >
              {content.length}/{maxLength}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={isSubmitDisabled}>
              {submitting ? submitBusyText : submitButtonText}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_IMAGE_CONTENT_TYPES.join(",")}
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];

                if (!file) {
                  return;
                }

                await onUploadImage(file);
                event.target.value = "";
              }}
            />
            <Button
              type="button"
              variant="outline"
              disabled={!canUploadImages}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploadingImage ? "Uploading..." : "Upload Image"}
            </Button>
            {isEditing && onCancelEdit ? (
              <Button
                type="button"
                variant="outline"
                disabled={isBusy}
                onClick={onCancelEdit}
              >
                Cancel Edit
              </Button>
            ) : null}
          </div>
          {!isEditing ? (
            <p className="text-xs text-[var(--app-muted)]">
              Save the document once to enable image uploads.
            </p>
          ) : null}
        </form>

        <div className="rounded-md border border-[var(--app-border)] p-4 min-w-0">
          <h3 className="mb-3 text-sm font-medium text-[var(--app-muted)]">
            Live Preview
          </h3>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold min-w-0 break-words">
              {title.trim() || "Untitled Draft"}
            </h2>
            <MarkdownPreview
              content={content}
              fallback="Nothing to preview yet."
              className="text-sm"
            />
          </div>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
