import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * Static showcase of past paid missions.
 * Purely illustrative: it never reads the database.
 */
const PAID_HISTORY = [
  { subreddit: "lumenapp", amount: 5, when: "2 hours ago" },
  { subreddit: "orbitai", amount: 5, when: "5 hours ago" },
  { subreddit: "shipfast_hq", amount: 5, when: "8 hours ago" },
  { subreddit: "nordwallet", amount: 5, when: "Yesterday" },
  { subreddit: "pixelforge", amount: 5, when: "Yesterday" },
  { subreddit: "tallyhq", amount: 5, when: "2 days ago" },
  { subreddit: "relaydev", amount: 5, when: "2 days ago" },
  { subreddit: "atlas_os", amount: 5, when: "3 days ago" },
];

export function CommunityHistory({ className = "" }: { className?: string }) {
  return (
    <section className={className}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Recently paid missions</h2>
        <span className="text-xs text-muted-foreground">
          Community activity — details hidden for privacy
        </span>
      </div>

      <div className="mt-4 grid gap-3">
        {PAID_HISTORY.map((item, i) => (
          <div
            key={i}
            className="panel flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold select-none blur-[5px]">
Launch task pack completed for @{item.subreddit}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span>@{item.subreddit}</span>
                <span>{item.when}</span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-sm font-semibold">${item.amount}</span>
              <Badge className="bg-success text-success-foreground">
                <CheckCircle2 className="mr-1 h-3 w-3" /> Paid
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
