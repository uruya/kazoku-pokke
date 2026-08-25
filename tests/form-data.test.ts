import { describe, expect, it } from "vitest";
import { optionalText, requiredText } from "../lib/form-data";

describe("フォーム入力の整形", () => {
  it("必須文字列の前後空白を取り除く", () => {
    const formData = new FormData();
    formData.set("title", "  連絡帳を書く  ");
    expect(requiredText(formData, "title")).toBe("連絡帳を書く");
  });

  it("空の任意項目はnullにする", () => {
    const formData = new FormData();
    formData.set("note", "   ");
    expect(optionalText(formData, "note")).toBeNull();
  });

  it("必須項目が空なら拒否する", () => {
    const formData = new FormData();
    expect(() => requiredText(formData, "title")).toThrow(
      "必須項目を入力してください。",
    );
  });
});
