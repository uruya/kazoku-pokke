import { describe, expect, it } from "vitest";
import { validContactEmail } from "../lib/contact";

describe("公開問い合わせ先", () => {
  it("正しいメールアドレスだけを公開する", () => {
    expect(validContactEmail(" support@example.com ")).toBe(
      "support@example.com",
    );
    expect(validContactEmail("not-an-email")).toBeNull();
    expect(validContactEmail(undefined)).toBeNull();
  });
});
