export const BLOG_SITE_URL = "https://karma-mission-market.lovable.app";

export type BlogSection = { id: string; title: string; paragraphs: string[]; bullets?: string[] };
export type BlogArticle = {
  slug: string; title: string; description: string; category: string;
  publishedAt: string; readMinutes: number; summary: string; sections: BlogSection[];
};

export const blogArticles: BlogArticle[] = [
  {
    slug: "get-paid-on-x",
    title: "Can you really get paid for engaging on X?",
    description: "How xlaunchclub task packs work: reply, like, repost and bookmark a curated launch post and earn $5 once approved.",
    category: "Getting started", publishedAt: "2026-11-16", readMinutes: 4,
    summary: "Yes. xlaunchclub pays verified X users $5 per approved task pack: one curated launch post, four genuine actions — reply, like, repost and bookmark.",
    sections: [
      { id: "what-is-a-pack", title: "What is a task pack?", paragraphs: [
        "Founders launching a product on X need real people in their replies during the first hours. xlaunchclub curates those launch posts and turns each one into a task pack.",
        "A pack is four actions on the same post. You complete them together, submit the link to your reply, and our team reviews it manually.",
      ], bullets: ["Reply with the provided text, typed by hand.", "Like the post.", "Repost it.", "Bookmark it."] },
      { id: "who-can-join", title: "Who can join?", paragraphs: [
        "Every X account is reviewed by hand. We look for profiles at least six months old, with a real photo, a bio and a natural posting history — no spam, no suspensions, no bought followers.",
        "Use your own account. Bought or freshly created accounts are refused.",
      ] },
      { id: "getting-paid", title: "How payment works", paragraphs: [
        "Your actions must stay in place for at least three hours. Once approved, you receive a claim link by email and pick from the available crypto, PayPal or bank transfer options.",
      ] },
    ],
  },
  {
    slug: "x-account-requirements",
    title: "What makes an X account eligible for xlaunchclub?",
    description: "The account criteria we check before giving access to paid X launch missions, and how to improve your chances.",
    category: "Membership", publishedAt: "2026-11-16", readMinutes: 3,
    summary: "Founders pay for genuine voices. That is why every xlaunchclub member is reviewed by a human before getting access to missions.",
    sections: [
      { id: "criteria", title: "The criteria", paragraphs: ["We review each profile as a whole rather than a single metric."], bullets: [
        "Account at least six months old.", "Real profile photo and bio.", "Regular, natural activity.", "Clean reputation: no spam, no suspensions, no fake followers.",
      ] },
      { id: "stay-natural", title: "Stay natural between packs", paragraphs: [
        "Keep posting and interacting on X like you normally would. Accounts that only engage with sponsored launches can be limited by X — and stop being useful to founders.",
      ] },
    ],
  },
  {
    slug: "reserve-before-you-act",
    title: "Why you must reserve a mission before acting",
    description: "Reservations protect every member: one launch post, one person, ten minutes to complete the pack.",
    category: "Missions", publishedAt: "2026-11-16", readMinutes: 3,
    summary: "Each launch post can be completed by one member only. Taking the mission reserves it for you for 10 minutes and unlocks the post link.",
    sections: [
      { id: "how", title: "How reservations work", paragraphs: [
        "Click Take this mission. The X post link unlocks and the mission disappears for everyone else. Complete the four actions, then paste your reply link before the timer ends.",
        "If time runs out, the mission goes back online automatically.",
      ] },
      { id: "why", title: "Why it matters", paragraphs: [
        "Actions done without a reservation can't be matched to you and won't be paid. Reserving first is the only way to guarantee your $5.",
      ] },
    ],
  },
];

export function getBlogArticle(slug: string) {
  return blogArticles.find((article) => article.slug === slug);
}
