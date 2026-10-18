import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildFamilyChangeNotification, hasImportantChanges } from "../lib/family-notification-content";

const mocks = vi.hoisted(() => ({
  findMany: vi.fn(), deleteMany: vi.fn(), sendPush: vi.fn(), sendEmail: vi.fn(), after: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("next/server", () => ({ after: mocks.after }));
vi.mock("@/lib/prisma", () => ({ prisma: {
  user: { findMany: mocks.findMany }, pushSubscription: { deleteMany: mocks.deleteMany },
} }));
vi.mock("@/lib/push-notifications", () => ({ sendPushNotification: mocks.sendPush }));
vi.mock("@/lib/resend", () => ({ sendReminderEmail: mocks.sendEmail }));
vi.mock("@/lib/family-notification-content", async () => import("../lib/family-notification-content"));
import { notifyFamilyChange, sendFamilyChangeNotification } from "../lib/family-notifications";

const change = { householdId: "family-a", actorUserId: "actor", kind: "病院" as const, action: "added" as const };

describe("家族への更新通知", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.sendPush.mockResolvedValue("sent");
    mocks.sendEmail.mockResolvedValue(undefined);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("本人と別家庭を送信対象から除外し、通知設定のある家族だけ取得する", async () => {
    mocks.findMany.mockResolvedValue([]);
    await sendFamilyChangeNotification(change);
    expect(mocks.findMany).toHaveBeenCalledWith({
      where: {
        id: { not: "actor" }, memberships: { some: { householdId: "family-a" } },
        OR: [{ emailReminderEnabled: true, email: { not: null } }, { pushSubscriptions: { some: {} } }],
      }, include: { pushSubscriptions: true },
    });
    expect(mocks.sendEmail).not.toHaveBeenCalled();
    expect(mocks.sendPush).not.toHaveBeenCalled();
  });

  it("メールと各端末へ配信し、メールOFFは尊重する", async () => {
    mocks.findMany.mockResolvedValue([
      { id: "member", email: "member@example.com", emailReminderEnabled: true, pushSubscriptions: [{ id: "device-a" }, { id: "device-b" }] },
      { id: "push-only", email: "off@example.com", emailReminderEnabled: false, pushSubscriptions: [{ id: "device-c" }] },
    ]);
    await sendFamilyChangeNotification(change);
    expect(mocks.sendEmail).toHaveBeenCalledTimes(1);
    expect(mocks.sendEmail).toHaveBeenCalledWith(expect.objectContaining({ to: "member@example.com", text: expect.stringContaining("/medical") }));
    expect(mocks.sendPush).toHaveBeenCalledTimes(3);
    expect(mocks.sendPush).toHaveBeenCalledWith({ id: "device-a" }, expect.objectContaining({ url: "/medical", tag: expect.stringMatching(/^family-change-/) }));
  });

  it("一つの配信が失敗しても残りへ送り、期限切れ端末を削除する", async () => {
    mocks.findMany.mockResolvedValue([
      { id: "member", email: "member@example.com", emailReminderEnabled: true, pushSubscriptions: [{ id: "broken" }, { id: "expired" }, { id: "good" }] },
    ]);
    mocks.sendEmail.mockRejectedValue(new Error("mail failure"));
    mocks.sendPush.mockRejectedValueOnce(new Error("push failure")).mockResolvedValueOnce("expired").mockResolvedValueOnce("sent");
    await expect(sendFamilyChangeNotification(change)).resolves.toBeUndefined();
    expect(mocks.sendPush).toHaveBeenCalledTimes(3);
    expect(mocks.deleteMany).toHaveBeenCalledWith({ where: { id: "expired", userId: "member" } });
  });

  it("保存の応答後に送信し、通知処理の失敗を保存エラーにしない", async () => {
    notifyFamilyChange(change);
    expect(mocks.findMany).not.toHaveBeenCalled();
    mocks.findMany.mockRejectedValue(new Error("database failure"));
    await expect(mocks.after.mock.calls[0][0]()).resolves.toBeUndefined();
  });

  it("同じ日時やメモのみの編集では重要変更とせず、期限の追加・削除を検出する", () => {
    const date = new Date("2026-10-19T01:00:00Z");
    expect(hasImportantChanges({ date, note: "before" }, { date: new Date(date), note: "after" }, ["date"])).toBe(false);
    expect(hasImportantChanges({ date }, { date: new Date(date.getTime() + 60_000) }, ["date"])).toBe(true);
    expect(hasImportantChanges({ date: null }, { date }, ["date"])).toBe(true);
    expect(hasImportantChanges({ date }, { date: null }, ["date"])).toBe(true);
  });

  it.each(["added", "updated", "deleted"] as const)("%sの通知に個人情報を含めず適切な画面へ誘導する", (action) => {
    const payload = buildFamilyChangeNotification("病院", action);
    expect(payload.title).toBe("かぞくポッケ｜家族からの共有");
    expect(payload.url).toBe("/medical");
    expect(payload.body).toContain({ added: "追加", updated: "変更", deleted: "削除" }[action]);
  });
});
