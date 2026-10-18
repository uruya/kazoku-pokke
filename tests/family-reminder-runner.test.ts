import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ findMany: vi.fn(), deleteMany: vi.fn(), upsert: vi.fn(), update: vi.fn(), sendEmail: vi.fn(), sendPush: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/prisma", () => ({ prisma: {
  user: { findMany: mocks.findMany },
  reminderDelivery: { deleteMany: mocks.deleteMany, upsert: mocks.upsert, update: mocks.update },
  pushSubscription: { update: mocks.update, delete: mocks.deleteMany },
} }));
vi.mock("@/lib/push-notifications", () => ({ sendPushNotification: mocks.sendPush }));
vi.mock("@/lib/resend", () => ({ sendReminderEmail: mocks.sendEmail }));
vi.mock("@/lib/reminders", async () => import("../lib/reminders"));
import { runDueDateReminders } from "../lib/reminder-runner";

beforeEach(() => vi.resetAllMocks());
it("前日のまとめは登録者を含む家族全員へ送り、送信済みメール・端末には再送しない", async () => {
  const targetDate = new Date("2026-10-18T15:00:00Z");
  mocks.findMany.mockResolvedValue(["actor", "member"].map((id) => ({
    id, email: `${id}@example.com`, emailReminderEnabled: true, displayName: null,
    pushSubscriptions: [{ id: `device-${id}`, lastReminderDate: null }],
    memberships: [{ household: { name: "家庭", todos: [{ title: "準備", dueDate: targetDate }], nurseryItems: [], medicalSchedules: [] } }],
  })));
  mocks.upsert.mockResolvedValue({ id: "delivery", sentAt: null });
  mocks.sendPush.mockResolvedValue("sent");
  const result = await runDueDateReminders(new Date("2026-10-18T08:00:00+09:00"));
  expect(result).toMatchObject({ emailSent: 2, pushSent: 2, failed: 0 });
  expect(mocks.sendEmail.mock.calls.map(([message]) => message.to)).toEqual(["actor@example.com", "member@example.com"]);
  expect(mocks.findMany.mock.calls[0][0].where).not.toHaveProperty("id");
  const users = await mocks.findMany.mock.results[0].value;
  users.forEach((user: { pushSubscriptions: { lastReminderDate: Date | null }[] }) => { user.pushSubscriptions[0].lastReminderDate = targetDate; });
  mocks.upsert.mockResolvedValue({ id: "delivery", sentAt: new Date() });
  mocks.sendEmail.mockClear();
  mocks.sendPush.mockClear();
  await runDueDateReminders(new Date("2026-10-18T08:30:00+09:00"));
  expect(mocks.sendEmail).not.toHaveBeenCalled();
  expect(mocks.sendPush).not.toHaveBeenCalled();
});
