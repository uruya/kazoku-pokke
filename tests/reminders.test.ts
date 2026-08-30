import { describe, expect, it } from "vitest";
import { buildReminderEmail, reminderWindow } from "../lib/reminders";

describe("期限前メール通知", () => {
  it("日本時間の翌日だけを通知対象期間にする", () => {
    const now = new Date("2026-08-30T23:00:00+09:00");
    const { start, end } = reminderWindow(now);

    expect(start.toISOString()).toBe("2026-08-30T15:00:00.000Z");
    expect(end.toISOString()).toBe("2026-08-31T15:00:00.000Z");
  });

  it("予定を1通へまとめ、入力値をHTMLエスケープする", () => {
    const email = buildReminderEmail({
      displayName: "あや<さん>",
      appUrl: "https://example.com",
      items: [
        {
          kind: "TODO",
          title: "着替え袋 & タオル",
          householdName: "山田家",
          date: new Date("2026-09-01T00:00:00+09:00"),
          includesTime: false,
        },
      ],
    });

    expect(email.subject).toContain("9/1");
    expect(email.text).toContain("着替え袋 & タオル");
    expect(email.html).toContain("あや&lt;さん&gt;");
    expect(email.html).toContain("着替え袋 &amp; タオル");
    expect(email.html).not.toContain("あや<さん>");
  });
});
