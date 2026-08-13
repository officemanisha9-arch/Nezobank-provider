// Static seed data used to pre-populate the panel on first load.
// This panel is frontend-only: everything is persisted to localStorage
// from here on, and there is no server involved.

import type { Article } from "./articles";
import type { Blog } from "./blogs";

export const SEED_ARTICLES: Article[] = [
  {
    id: "a-1",
    slug: "trading-features",
    title: "New Trading Features Rolled Out",
    category: "Features",
    date: "March 2026",
    image: "/front.jpg",
    excerpt: "A look at the latest trading tools now live on the platform.",
    content: "<p>We shipped a set of new trading features designed to make executing trades faster and more transparent for every user.</p>",
    status: "published",
  },
  {
    id: "a-2",
    slug: "security-upgrade",
    title: "Platform Security Upgrade",
    category: "Security",
    date: "February 2026",
    image: "/front.jpg",
    excerpt: "How we strengthened account protection this quarter.",
    content: "<p>This quarter we rolled out additional account protection layers across the platform.</p>",
    status: "draft",
  },
];

export const SEED_BLOGS: Blog[] = [
  {
    id: "b-1",
    slug: "safe-fast-transactions",
    title: "Safe & Fast Transactions, Every Time",
    excerpt: "How our infrastructure keeps every transaction quick and secure.",
    content: "<p>Every transaction on our platform is processed with speed and safety as the top priority.</p>",
    image: "/front.jpg",
    author: "Nezobank Team",
    authorImage: "",
    date: "March 2026",
    readTime: "5 min read",
    category: "Transactions",
    premium: false,
    views: "1.2k",
    status: "published",
  },
  {
    id: "b-2",
    slug: "getting-started-guide",
    title: "Getting Started With Your Account",
    excerpt: "Everything new users need to know in their first week.",
    content: "<p>Welcome aboard! Here's a quick guide to help you get the most out of your account.</p>",
    image: "/front.jpg",
    author: "Nezobank Team",
    authorImage: "",
    date: "January 2026",
    readTime: "4 min read",
    category: "Guides",
    premium: false,
    views: "3.4k",
    status: "published",
  },
];
