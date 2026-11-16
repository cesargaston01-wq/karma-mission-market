import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export const BRAND_NAME = "Aurum";

/** Gold monogram + wordmark used across every page header. */
export function BrandMark({ className, size = "md" }: { className?: string; size?: "sm" | "md" }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className={cn(
          "bg-gold relative inline-flex shrink-0 items-center justify-center rounded-lg font-display font-bold text-primary-foreground shadow-[var(--shadow-glow)]",
          size === "sm" ? "h-6 w-6 text-sm" : "h-8 w-8 text-lg",
        )}
      >
        A
      </span>
      <span className={cn("font-display font-semibold tracking-wide", size === "sm" ? "text-base" : "text-xl")}>
        Aurum<span className="text-primary">.</span>
      </span>
    </span>
  );
}

export function BrandLink({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("min-w-0", className)} aria-label="Aurum home">
      <BrandMark />
    </Link>
  );
}

/** Small X logo glyph. */
export function XGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("h-4 w-4 fill-current", className)}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
