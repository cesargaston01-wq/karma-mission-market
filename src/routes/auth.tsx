import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/password-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/lib/data";
import { BrandMark } from "@/components/brand";

// The editor preview can't send Resend emails itself, so it asks the live site to do it.
const LIVE_SITE = "https://karma-mission-market.lovable.app";
async function liveAuthAction(
  body: Record<string, string>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const r = await fetch(`${LIVE_SITE}/api/public/auth-action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await r.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (data?.ok) return { ok: true };
    return { ok: false, error: data?.error || "Could not send the email. Publish the site and try again." };
  } catch {
    return { ok: false, error: "Could not send the email. Publish the site and try again." };
  }
}
import {
  signUpWithResend,
  resendConfirmationWithResend,
  resetPasswordWithResend,
} from "@/lib/auth-emails.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — xlaunchclub" },
      {
        name: "description",
        content: "Apply with your X account or sign in to access paid launch missions.",
      },
      { property: "og:title", content: "Sign in — xlaunchclub" },
      { property: "og:description", content: "Access your xlaunchclub missions dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),

  component: AuthPage,
});

const signupSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "8 characters minimum").max(72),
  reddit_profile_url: z
    .string()
    .trim()
    .max(255)
    .regex(
      /^https:\/\/x\.com\/[A-Za-z0-9_]{1,15}$/,
      "e.g. https://x.com/username or @username",
    ),
});

function normalizeXUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!trimmed) return trimmed;
  const fromUrl = trimmed.match(/^https?:\/\/(?:www\.|mobile\.)?(?:x|twitter)\.com\/([A-Za-z0-9_]{1,15})(?:[/?#].*)?$/i);
  if (fromUrl) return `https://x.com/${fromUrl[1]}`;
  const handle = trimmed.replace(/^@/, "").trim();
  if (/^[A-Za-z0-9_]{1,15}$/.test(handle)) return `https://x.com/${handle}`;
  return trimmed;
}

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [showConfirmMessage, setShowConfirmMessage] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const { data: user, isLoading: isRestoringSession } = useSession();

  // Remember an invite code from ?ref=... so it survives navigation.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref && /^[a-z0-9]{4,32}$/i.test(ref)) localStorage.setItem("taskreddit_ref", ref.toLowerCase());
    const confirmed = params.get("confirmed");
    if (confirmed === "1") toast.success("Email confirmed! You can now log in.");
    else if (confirmed === "invalid") toast.error("This confirmation link is invalid or expired. Log in to get a new one.");
  }, []);

  useEffect(() => {
    if (user) navigate({ to: "/opportunities/comments", replace: true });
  }, [navigate, user]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    setPendingEmail(email);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: String(fd.get("password") ?? ""),
    });
    setLoading(false);
    if (error) {
      const message = error.message.toLowerCase();
      if (
        message.includes("email not confirmed") ||
        error.code === "email_not_confirmed" ||
        message.includes("not confirmed")
      ) {
        setConfirmEmail(email);
        setShowConfirmMessage(true);
        return;
      }
      return toast.error(error.message);
    }
    navigate({ to: "/opportunities/comments" });
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const xUrl = normalizeXUrl(String(fd.get("reddit_profile_url") ?? ""));
    const parsed = signupSchema.safeParse({
      email: fd.get("email"),
      password: fd.get("password"),
      reddit_profile_url: xUrl,
    });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    const xUsername =
      parsed.data.reddit_profile_url.replace(/\/+$/, "").split("/").pop() ??
      parsed.data.email.split("@")[0];

    setLoading(true);
    try {
      const res = await signUpWithResend({
        data: {
          email: parsed.data.email,
          password: parsed.data.password,
          full_name: xUsername,
          reddit_profile_url: parsed.data.reddit_profile_url,
          referral_code: localStorage.getItem("taskreddit_ref") ?? "",
        },
      });
      if (!res.ok && res.fallback) {
        const live = await liveAuthAction({
          action: "signup",
          email: parsed.data.email,
          password: parsed.data.password,
          full_name: xUsername,
          reddit_profile_url: parsed.data.reddit_profile_url,
          referral_code: localStorage.getItem("taskreddit_ref") ?? "",
        });
        if (!live.ok) return toast.error(live.error);
      } else if (!res.ok) {
        return toast.error(res.error);
      }
      setConfirmEmail(parsed.data.email);
      setShowConfirmMessage(true);
      return;
    } catch (err) {
      return toast.error(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
    toast.success("Account created. Your X profile is being reviewed.");
    navigate({ to: "/opportunities/comments" });
  }

  async function resendConfirmation() {
    if (!confirmEmail) return;
    setLoading(true);
    try {
      const res = await resendConfirmationWithResend({ data: { email: confirmEmail } });
      if (!res.ok && res.fallback) {
        const live = await liveAuthAction({ action: "resend", email: confirmEmail });
        if (!live.ok) throw new Error(live.error);
      }
    } catch {
      setLoading(false);
      return toast.error("Could not resend the email. Try again.");
    }
    setLoading(false);
    toast.success("Confirmation email resent. Check your inbox.");
  }

  async function handleForgotPassword() {
    const email = window.prompt("Enter your email to receive a reset link:");
    if (!email) return;
    setLoading(true);
    try {
      const res = await resetPasswordWithResend({ data: { email: email.trim() } });
      if (!res.ok && res.fallback) {
        const live = await liveAuthAction({ action: "reset", email: email.trim() });
        if (!live.ok) throw new Error(live.error);
      }
    } catch {
      setLoading(false);
      return toast.error("Could not send the reset email. Try again.");
    }
    setLoading(false);
    toast.success("Password reset email sent. Check your inbox.");
  }

  if (isRestoringSession || user) {
    return (
      <div className="hero-surface flex min-h-screen items-center justify-center px-5">
        <p className="text-sm text-muted-foreground">Restoring your session…</p>
      </div>
    );
  }

  if (showConfirmMessage) {
    return (
      <div className="hero-surface flex min-h-screen flex-col items-center justify-center px-5 py-12">
        <Link to="/" className="mb-10">
          <BrandMark />
        </Link>
        <div className="panel elevated w-full max-w-md p-6 text-center">
          <h1 className="mb-4 text-xl font-bold">Confirm your email</h1>
          <p className="mb-4 text-sm text-muted-foreground">
            We sent a confirmation link to{" "}
            <strong className="text-foreground">{confirmEmail}</strong>. Click it to activate your
            account.
          </p>
          <Button
            onClick={resendConfirmation}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            Resend confirmation email
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            Already confirmed?{" "}
            <button
              type="button"
              onClick={() => setShowConfirmMessage(false)}
              className="underline hover:text-foreground"
            >
              Back to sign in
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-surface flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <Link to="/" className="mb-10">
          <BrandMark />
        </Link>

      <h1 className="mb-2 text-center text-4xl md:text-5xl">Join the <em className="text-brand not-italic">circle</em></h1>
      <p className="mb-8 text-center text-sm text-muted-foreground">Paid task packs for verified X users.</p>

      <div className="panel elevated w-full max-w-md p-6">
        <Tabs defaultValue="signup">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Sign up</TabsTrigger>
            <TabsTrigger value="login">Sign in</TabsTrigger>
          </TabsList>

          <TabsContent value="signup" className="mt-6">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="s-email">Email</Label>
                <Input id="s-email" name="email" type="email" required maxLength={255} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-pass">Password</Label>
                <PasswordInput id="s-pass" name="password" required minLength={8} maxLength={72} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="s-reddit">Your X profile link or @handle</Label>
                <Input
                  id="s-reddit"
                  name="reddit_profile_url"
                  placeholder="@yourhandle"
                  required
                  maxLength={255}
                />
              </div>
              <Button type="submit" className="bg-brand w-full text-primary-foreground hover:opacity-90" disabled={loading}>
                Apply with my X account
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Your account stays pending until it's manually reviewed.
              </p>
            </form>
          </TabsContent>

          <TabsContent value="login" className="mt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="l-email">Email</Label>
                <Input
                  id="l-email"
                  name="email"
                  type="email"
                  required
                  defaultValue={pendingEmail}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="l-pass">Password</Label>
                <PasswordInput id="l-pass" name="password" required />
              </div>
              <p className="text-right text-xs">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-muted-foreground underline hover:text-foreground"
                >
                  Forgot password?
                </button>
              </p>
              <p className="text-xs text-muted-foreground">
                You'll stay signed in on this device until you sign out.
              </p>
              <Button type="submit" className="w-full" disabled={loading}>
                Sign in
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
