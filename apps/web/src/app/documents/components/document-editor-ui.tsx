"use client";

import { type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownPreview } from "./markdown-preview";

type EditorMode = "compose" | "preview";

type DocumentEditorUIProps = {
  title: string;
  content: string;
  mode: EditorMode;
  isEditing: boolean;
  isBusy: boolean;
  isSubmitDisabled: boolean;
  submitting: boolean;
  error: string | null;
  onModeChange: (mode: EditorMode) => void;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancelEdit?: () => void;
  submitButtonText: string;
  submitBusyText: string;
  maxLength: number;
};

export function DocumentEditorUI({
  title,
  content,
  mode,
  isEditing,
  isBusy,
  isSubmitDisabled,
  submitting,
  error,
  onModeChange,
  onTitleChange,
  onContentChange,
  onSubmit,
  onCancelEdit,
  submitButtonText,
  submitBusyText,
  maxLength,
}: DocumentEditorUIProps) {
  const isContentTooLong = content.length > maxLength;

  return (
    <>
      <div className="inline-flex rounded border border-[var(--app-border)] p-1">
        <Button
          type="button"
          size="sm"
          variant={mode === "compose" ? "default" : "outline"}
          onClick={() => onModeChange("compose")}
        >
          Compose
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "preview" ? "default" : "outline"}
          onClick={() => onModeChange("preview")}
          className="ml-2"
        >
          Preview
        </Button>
      </div>

      {mode === "compose" ? (
        <form onSubmit={onSubmit} className="space-y-4">
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
              id="content"
              value={content}
              onChange={(event) => onContentChange(event.target.value)}
              required
              placeholder="Write markdown content."
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-[var(--app-muted)]">Character count</p>
            <p className={`text-xs ${isContentTooLong ? "text-red-400" : "text-[var(--app-muted)]"}`}>
              {content.length}/{maxLength}
            </p>
          </div>

          <Button type="submit" disabled={isSubmitDisabled}>
            {submitting ? submitBusyText : submitButtonText}
          </Button>
          {isEditing && onCancelEdit ? (
        <Button type="button" variant="outline" disabled={isBusy} onClick={onCancelEdit}>
              Cancel Edit
            </Button>
          ) : null}
        </form>
      ) : (
        <div className="space-y-3 rounded-md border border-[var(--app-border)] p-4">
          <h2 className="text-lg font-semibold">{title.trim() || "Untitled Draft"}</h2>
          <MarkdownPreview content={content.trim() || "Nothing to preview yet."} className="text-sm" />
        </div>
      )}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </>
  );
}
