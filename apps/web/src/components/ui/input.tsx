import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full rounded border border-[var(--app-border)] bg-[var(--app-background)] px-3 py-2 text-sm outline-none transition focus:border-[var(--app-link-hover)] focus:ring-2 focus:ring-[var(--app-link-hover)]/20",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
