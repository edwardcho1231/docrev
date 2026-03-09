import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-10 h-16 border-b border-[var(--app-border)] bg-[var(--app-surface)]/75 backdrop-blur">
      <div className="mx-auto w-full flex h-full items-center px-5">
        <div className="flex h-10 w-full items-center justify-between gap-3">
          <Link
            href="/"
            aria-label="Go to home"
            className="flex h-10 w-10 items-center justify-center text-[var(--app-muted)] transition-colors hover:text-[var(--app-link-hover)]"
          >
            <i aria-hidden="true" className="fa-solid fa-house text-sm leading-none" />
          </Link>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="h-10 rounded border border-[var(--app-border)] px-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-muted)] transition hover:border-[var(--app-link-hover)] hover:text-[var(--app-link-hover)]">
                Log in
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex h-10 items-center">
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
