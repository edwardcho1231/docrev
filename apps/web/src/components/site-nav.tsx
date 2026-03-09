import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--app-border)] bg-[var(--app-surface)]/75 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-end px-5 py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/documents"
            className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--app-muted)] transition-colors hover:text-[var(--app-link-hover)]"
          >
            Documents
          </Link>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded border border-[var(--app-border)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-muted)] transition hover:border-[var(--app-link-hover)] hover:text-[var(--app-link-hover)]">
                Log in
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
