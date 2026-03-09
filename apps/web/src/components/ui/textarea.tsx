import * as React from "react";
import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full min-h-28 rounded border border-[var(--app-border)] bg-[var(--app-background)] px-3 py-2 text-sm outline-none transition focus:border-[var(--app-link-hover)] focus:ring-2 focus:ring-[var(--app-link-hover)]/20",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
