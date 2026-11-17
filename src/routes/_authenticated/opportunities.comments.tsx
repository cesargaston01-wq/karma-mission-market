import { createFileRoute } from "@tanstack/react-router";
import { CommunityHistory } from "@/components/community-history";
import { DashboardLayout } from "@/components/dashboard-layout";
import { OpportunityList } from "@/components/opportunity-list";

export const Route = createFileRoute("/_authenticated/opportunities/comments")({
  head: () => ({
    meta: [
      { title: "Missions — xlaunchclub" },
      { name: "description", content: "Paid X task packs rewarded $5 each." },
      { property: "og:title", content: "Missions — xlaunchclub" },
      { property: "og:description", content: "Browse and reserve paid X launch task packs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <DashboardLayout
      title="Missions"
      description="Reply, like, repost and bookmark one launch post. $5 per approved task pack."
    >
      <OpportunityList type="comment" />
      <CommunityHistory className="mt-10" />
    </DashboardLayout>
  ),
});
