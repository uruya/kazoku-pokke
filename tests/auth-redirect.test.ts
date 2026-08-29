import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "../lib/auth-redirect";

describe("safeRedirectPath", () => {
  it("allows an internal path", () => {
    expect(safeRedirectPath("/invite/abc?from=test")).toBe(
      "/invite/abc?from=test",
    );
  });

  it.each([
    "https://example.com",
    "//example.com/path",
    "/\\example.com",
    "/%2f%2fexample.com",
    "/%5cexample.com",
    "todos",
    null,
  ])("rejects an unsafe redirect: %s", (value) => {
    expect(safeRedirectPath(value)).toBe("/");
  });
});
