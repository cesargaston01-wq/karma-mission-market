import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/xlaunchclub-logo.png.asset.json";

export const BRAND_NAME = "xlaunchclub";

/** Brand logo used across every page header. */
export function BrandMark({ className, size = "md" }: { className?: string; size?: "sm" | "md" }) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <img
        src={logoAsset.url}
        alt="xlaunchclub"
        className={cn("w-auto", size === "sm" ? "h-5" : "h-7")}
      />
    </span>
  );
}

export function BrandLink({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("min-w-0", className)} aria-label="xlaunchclub home">
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
