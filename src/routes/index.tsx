import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bookmark,
  Heart,
  MessageCircle,
  Repeat2,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects";
import HowItWorks from "@/components/ui/how-it-works";
import { BrandLink, BrandMark, XGlyph } from "@/components/brand";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { POST_LISTING_URL } from "@/lib/community";
import { PAYOUT_PACK, useSession } from "@/lib/data";

const faqs = [
  {
    q: "What is a task pack?",
    a: `Each mission is one X post from a product launch. You reply with the provided text, like it, repost it and bookmark it. The four actions together earn $${PAYOUT_PACK}.`,
  },
  {
    q: "Who publishes the missions?",
    a: "Every mission is curated by the xlaunchclub team for founders launching on X. We only accept launches we would be proud to support.",
  },
  {
    q: "When do I get paid?",
    a: "We manually check your reply, like, repost and bookmark after they have stayed online for at least 3 hours. Once approved, you receive a claim link by email and choose from the available payout methods. Processing times vary.",
  },
  {
    q: "Can I undo the actions afterwards?",
    a: "No. Replies, likes, reposts and bookmarks must stay in place. Removing them after payment results in your future missions being refused.",
  },
  {
    q: "What happens if my account is rejected?",
    a: "You see the reason in your dashboard. You can re-apply with an X account that meets the requirements.",
  },
  {
    q: "Can several people do the same mission?",
    a: "No. As soon as a mission is taken, it is reserved for you and disappears for everyone else.",
  },
];

const HOME_TITLE = "xlaunchclub — Get paid $5 to support X launches";
const HOME_DESCRIPTION =
  "Join a curated circle of X users. Reply, like, repost and bookmark launch posts and earn $5 per approved task pack.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: HOME_TITLE },
      { name: "description", content: HOME_DESCRIPTION },
      { property: "og:title", content: HOME_TITLE },
      { property: "og:description", content: HOME_DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Landing,
});

const steps = [
  {
    title: "Apply with your X account",
    text: "Sign up with your @handle. It takes less than a minute.",
  },
  {
    title: "Get verified",
    text: "We manually review the age, audience and overall quality of your X account.",
  },
  {
    title: "Complete task packs",
    text: "Reserve a launch post, reply, like, repost and bookmark it, then submit your reply link. Earn $5 once approved.",
  },
];

const actions = [
  { icon: MessageCircle, label: "Reply" },
  { icon: Heart, label: "Like" },
  { icon: Repeat2, label: "Repost" },
  { icon: Bookmark, label: "Bookmark" },
];

const criteria = [
  { icon: UserCheck, title: "Real, active profile", text: "Profile photo, bio and a natural posting history." },
  { icon: Sparkles, title: "6+ months old", text: "The X account must be at least six months old." },
  { icon: ShieldCheck, title: "Clean reputation", text: "No spam, no suspensions, no bought followers." },
];

function Landing() {
  const { data: user } = useSession();
  const cta = user ? "/opportunities/comments" : "/auth";

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
          <BrandLink />
          <nav className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/discover">Missions</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
              <Link to="/blog">Journal</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
              <a href={POST_LISTING_URL}>For founders</a>
            </Button>
            <Button asChild size="sm" className="bg-brand px-4 text-primary-foreground hover:opacity-90">
              <Link to={cta}>
                {user ? "Dashboard" : "Apply now"}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-surface relative overflow-hidden border-b border-border/60">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:64px_64px]"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-5 py-20 md:grid-cols-[1.15fr_1fr] md:py-32">
            <div className="text-center md:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3.5 py-1.5 text-xs tracking-wide text-primary">
                <XGlyph className="h-3 w-3" /> By invitation · Curated X launches
              </span>
              <h1 className="mt-7 text-4xl font-semibold leading-[1.05] md:text-6xl">
                Your X account,
                <br />
                <em className="text-brand not-italic">finally pays off.</em>
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:mx-0 md:text-lg">
                Founders launching on X need real people in their replies. Join a private circle of
                verified users and earn <span className="text-foreground">${PAYOUT_PACK}</span> for
                every task pack you complete.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <Button asChild size="lg" className="bg-brand h-12 px-7 text-primary-foreground hover:opacity-90">
                  <Link to={cta}>
                    {user ? "Go to dashboard" : "Apply with your X account"}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 border-primary/30 bg-transparent px-7">
                  <Link to="/discover">View missions</Link>
                </Button>
              </div>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground md:justify-start">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Manual review
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5 text-primary" /> Crypto · PayPal · Bank transfer
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-sm">
              <div aria-hidden className="absolute -inset-10 rounded-full bg-primary/15 blur-[100px]" />
              <div className="panel elevated relative overflow-hidden p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    Task pack
                  </span>
                  <XGlyph className="text-muted-foreground" />
                </div>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-brand font-display text-7xl font-semibold">${PAYOUT_PACK}</span>
                  <span className="text-sm text-muted-foreground">per launch post</span>
                </div>
                <div className="brand-hairline my-6" />
                <ul className="grid grid-cols-2 gap-3">
                  {actions.map((a) => (
                    <li
                      key={a.label}
                      className="flex items-center gap-2.5 rounded-xl border border-border bg-background/50 px-3 py-3 text-sm"
                    >
                      <a.icon className="h-4 w-4 text-primary" />
                      {a.label}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                  Four actions on one curated launch post. Paid after manual approval.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-6xl px-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">The method</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Three steps to your first payout</h2>
          </div>
          <div className="mt-12">
            <HowItWorks
              features={steps.map((s, i) => ({
                title: s.title,
                description: s.text,
                colorTheme: (["orange", "blue", "purple"] as const)[i % 3],
              }))}
            />
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-border/60 bg-surface/30 py-24">
          <div className="relative mx-auto max-w-3xl px-5">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Membership</p>
              <h2 className="mt-3 text-4xl md:text-5xl">
                Reserved for <em className="text-brand not-italic">quality</em> accounts
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
                Founders pay for genuine voices. Every X account is reviewed by hand before it gets access.
              </p>
            </div>
            <div className="mt-12 space-y-3">
              {criteria.map((c) => (
                <div
                  key={c.title}
                  className="group flex items-center gap-5 rounded-2xl border border-border/60 bg-background/40 p-5 transition-colors duration-300 hover:border-primary/40"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                    <c.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-sans text-base font-semibold">{c.title}</h3>
                    <p className="text-sm text-muted-foreground">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-24">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">In numbers</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Built for the X launch economy</h2>
          </div>
          <FeaturesSectionWithHoverEffects />
        </section>

        <section className="border-y border-border/60 bg-surface/30">
          <div className="mx-auto max-w-3xl px-5 py-24">
            <h2 className="text-center text-4xl md:text-5xl">Questions</h2>
            <Accordion type="single" collapsible className="mt-10">
              {faqs.map((item, i) => (
                <AccordionItem key={item.q} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-28 text-center">
          <h2 className="text-5xl md:text-6xl">
            Turn your timeline <em className="text-brand not-italic">into income.</em>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
            Free to apply. Manual review before access to missions.
          </p>
          <Button asChild size="lg" className="bg-brand mt-9 h-12 px-8 text-primary-foreground hover:opacity-90">
            <Link to="/auth">
              Apply now <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </section>
      </main>

      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <BrandMark size="sm" />
            <span>© {new Date().getFullYear()} · Paid tasks for X users</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/blog" className="transition-colors hover:text-foreground">Journal</Link>
            <Link to="/discover" className="transition-colors hover:text-foreground">Missions</Link>
            <a href={POST_LISTING_URL} className="transition-colors hover:text-foreground">For founders</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
