import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLink } from "@/components/brand";
import { CommunityHistory } from "@/components/community-history";
import { MissionBrowser } from "@/components/opportunity-list";
import { useProfile, useSession } from "@/lib/data";

export const Route = createFileRoute("/discover")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Open missions — Aurum" },
      {
        name: "description",
        content:
          "Browse every open X launch mission: reply, like, repost and bookmark one post for $5 per approved task pack.",
      },
      { property: "og:title", content: "Open missions — Aurum" },
      {
        property: "og:description",
        content: "All open X launch task packs: $5 each.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),

  component: DiscoverPage,
});

function DiscoverPage() {
  const { data: user } = useSession();
  const { data: profile } = useProfile();
  const canSubmit = profile?.status === "accepted";


  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto grid h-16 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-5">
          <BrandLink />
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/blog">Journal</Link>
            </Button>
            <Button asChild size="sm" className="bg-brand px-4 text-primary-foreground hover:opacity-90">
              <Link to={user ? "/opportunities/comments" : "/auth"}>
                <span className="sm:hidden">{user ? "Dashboard" : "Get started"}</span>
                <span className="hidden sm:inline">{user ? "Go to dashboard" : "Apply now"}</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

      </header>

      <main className="mx-auto max-w-4xl px-5 py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Open missions</p>
        <h1 className="mt-3 text-5xl md:text-6xl">Today's X launches</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Every open mission, read-only. A verified X account is required to take one. $5 per task pack.
        </p>


        {!canSubmit ? (
          <div className="panel mt-6 p-4 text-sm text-muted-foreground">
            You're browsing missions in read-only mode.{" "}
            <Link to="/auth" className="text-primary hover:underline">
              Sign in with a verified account to apply
            </Link>
            .
          </div>
        ) : null}

        <div className="mt-6">
          <MissionBrowser type="comment" canSubmit={canSubmit} />
        </div>

        <CommunityHistory className="mt-14" />
      </main>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto max-w-6xl px-5 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Aurum — Paid tasks for X users.
        </div>
      </footer>
    </div>
  );
}
