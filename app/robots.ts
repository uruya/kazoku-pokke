import type { MetadataRoute } from "next";
import { getSiteUrl } from "../lib/site-url";

const privatePaths = [
  "/api/",
  "/children",
  "/households",
  "/invite/",
  "/login",
  "/medical",
  "/more",
  "/nursery",
  "/shopping",
  "/todos",
  "/welcome",
];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: ["/about", "/contact", "/privacy", "/terms"],
      disallow: privatePaths,
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
