import type { MetadataRoute } from "next";
import { getSiteUrl } from "../lib/site-url";

const publicPages = [
  { path: "/about", priority: 1 },
  { path: "/install", priority: 0.6 },
  { path: "/terms", priority: 0.4 },
  { path: "/privacy", priority: 0.4 },
  { path: "/contact", priority: 0.5 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return publicPages.map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === "/about" ? "weekly" : "monthly",
    priority,
  }));
}
