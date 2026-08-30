import { describe, expect, it } from "vitest";
import { isValidCronAuthorization } from "../lib/cron-auth";

describe("cron認証", () => {
  it("正しいBearerトークンだけを許可する", () => {
    expect(isValidCronAuthorization("Bearer secret", "secret")).toBe(true);
    expect(isValidCronAuthorization("Bearer wrong", "secret")).toBe(false);
    expect(isValidCronAuthorization(null, "secret")).toBe(false);
    expect(isValidCronAuthorization("Bearer secret", undefined)).toBe(false);
  });
});
