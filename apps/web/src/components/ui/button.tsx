import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline";
type ButtonSize = "default" | "sm" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const baseStyles =
  "inline-flex items-center justify-center rounded border font-semibold uppercase tracking-[0.12em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-foreground)]/20 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  default:
    "border-[var(--app-link-hover)] bg-[var(--app-foreground)] text-[var(--app-background)] hover:bg-black/85",
  outline:
    "border-[var(--app-border)] bg-transparent text-[var(--app-foreground)] hover:border-[var(--app-link-hover)]",
};

const sizes: Record<ButtonSize, string> = {
  default: "h-10 px-5 text-xs",
  sm: "h-8 px-3 text-[11px]",
  lg: "h-11 px-6 text-sm",
};

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
