import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { FROM_EMAIL, REPLY_TO, SITE_URL, UNSUBSCRIBED, button, emailLayout, escapeHtml, resendRequest } from "@/lib/email-layout.server";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
const body = z.object({ missionId: z.string().uuid() });

// Emails every accepted member when an admin publishes a new mission. Caller must be an admin.
export const Route = createFileRoute("/api/public/new-mission-alert")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        const json = (d: unknown, status = 200) => Response.json(d, { status, headers: cors });
        if (!process.env["RESEND_API_KEY"] || !process.env["LOVABLE_API_KEY"]) return json({ ok: false, error: "unavailable" }, 503);
        const parsed = body.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return json({ ok: false, error: "Invalid request" }, 400);
        let ctx;
        try {
          const { userClientFromAuthHeader } = await import("@/lib/supabase-token-client.server");
          ctx = await userClientFromAuthHeader(request.headers.get("authorization"));
        } catch {
          return json({ ok: false, error: "Unauthorized" }, 401);
        }
        const { supabase, userId } = ctx;
        const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
        if (!role) return json({ ok: false, error: "Admins only" }, 403);

        const { data: mission } = await supabase.from("missions").select("title, subreddit, payout, is_active").eq("id", parsed.data.missionId).maybeSingle();
        if (!mission || !mission.is_active) return json({ ok: false, error: "Mission not found or inactive" }, 404);

        const { data: members, error } = await supabase.from("profiles").select("email").eq("status", "accepted");
        if (error) return json({ ok: false, error: error.message }, 500);
        const emails = [...new Set((members ?? []).map((m) => (m.email ?? "").trim().toLowerCase()).filter((e) => e && !UNSUBSCRIBED.has(e)))];
        if (!emails.length) return json({ ok: true, recipients: 0 });

        const payout = Number(mission.payout ?? 5);
        const author = mission.subreddit ? `@${escapeHtml(mission.subreddit.replace(/^@/, ""))}` : "an X launch";
        const subject = `New mission available — earn $${payout} on xlaunchclub`;
        const html = emailLayout(
          subject,
          `<h1 style="color:#0F172A;font-size:24px;margin:0 0 16px;">A new mission is live</h1>
<p style="color:#334155;font-size:16px;line-height:1.5;margin:0 0 12px;"><strong>${escapeHtml(mission.title ?? "New X mission")}</strong> — a launch post from ${author}.</p>
<p style="color:#334155;font-size:16px;line-height:1.5;margin:0 0 24px;">Reply, like, repost and bookmark to earn <strong>$${payout}</strong>. First come, first served — reserve it before someone else does.</p>
${button(`${SITE_URL}/opportunities/comments`, "Reserve this mission")}`,
          `<br>You receive this because you are a verified xlaunchclub member.`,
        );
        for (let i = 0; i < emails.length; i += 100) {
          await resendRequest("/emails/batch", emails.slice(i, i + 100).map((to) => ({ from: FROM_EMAIL, to: [to], reply_to: REPLY_TO, subject, html })));
        }
        return json({ ok: true, recipients: emails.length });
      },
    },
  },
});
