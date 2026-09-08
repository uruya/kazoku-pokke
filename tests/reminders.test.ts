import { describe, expect, it } from "vitest";
import {
  buildReminderEmail,
  buildReminderPush,
  reminderWindow,
} from "../lib/reminders";

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

  it("Push通知では予定の件数と種類だけを表示し、ロック画面へ詳細を出さない", () => {
    const push = buildReminderPush([
      {
        kind: "病院",
        title: "表示しない予定名",
        householdName: "表示しない家庭名",
        date: new Date("2026-09-01T10:00:00+09:00"),
        includesTime: true,
      },
      {
        kind: "TODO",
        title: "表示しないTODO",
        householdName: "表示しない家庭名",
        date: new Date("2026-09-01T00:00:00+09:00"),
        includesTime: false,
      },
    ]);

    expect(push).toMatchObject({
      title: "かぞくポッケ｜明日の予定",
      body: "病院・TODOの予定が2件あります。",
      url: "/",
    });
    expect(JSON.stringify(push)).not.toContain("表示しない");
  });
});
