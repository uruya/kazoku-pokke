import { afterEach, describe, expect, it } from "vitest";
import { GET as healthcheck } from "../app/api/health/route";
import robots from "../app/robots";
import sitemap from "../app/sitemap";
import { getSiteUrl } from "../lib/site-url";

const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;

afterEach(() => {
  if (originalAppUrl === undefined) {
    delete process.env.NEXT_PUBLIC_APP_URL;
  } else {
    process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
  }
});

describe("public release metadata", () => {
  it("normalizes the configured site URL", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://kazoku-pokke.jp/path/";

    expect(getSiteUrl()).toBe("https://kazoku-pokke.jp");
  });

  it("publishes only public pages in the sitemap", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://kazoku-pokke.jp";

    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("https://kazoku-pokke.jp/about");
    expect(urls).toContain("https://kazoku-pokke.jp/privacy");
    expect(urls).not.toContain("https://kazoku-pokke.jp/todos");
  });

  it("keeps private and API routes out of search results", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://kazoku-pokke.jp";

    expect(robots().rules).toMatchObject({
      userAgent: "*",
      disallow: expect.arrayContaining(["/api/", "/invite/", "/todos"]),
    });
  });
});

describe("healthcheck", () => {
  it("returns an uncached success response", async () => {
    const response = healthcheck();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body).toMatchObject({ status: "ok", service: "kazoku-pokke" });
  });
});
