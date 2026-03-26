"use client";

import { UserButton, useAuth } from "@clerk/nextjs";

export function AuthNavControls() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded || !isSignedIn) {
    return (
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-muted)]">
        edwardcho.dev
      </span>
    );
  }

  return (
    <div className="flex h-10 items-center">
      <UserButton />
    </div>
  );
}
