import "server-only";

import { prisma } from "@/lib/prisma";
import {
  buildReminderEmail,
  reminderWindow,
  type ReminderItem,
} from "@/lib/reminders";
import { sendReminderEmail } from "@/lib/resend";

export type ReminderRunResult = {
  eligibleUsers: number;
  sent: number;
  skipped: number;
  failed: number;
};

export async function runDueDateReminders(
  now = new Date(),
): Promise<ReminderRunResult> {
  const { start, end } = reminderWindow(now);
  await prisma.reminderDelivery.deleteMany({
    where: { targetDate: { lt: new Date(start.getTime() - 35 * 86_400_000) } },
  });

  const users = await prisma.user.findMany({
    where: {
      emailReminderEnabled: true,
      email: { not: null },
      memberships: { some: {} },
    },
    include: {
      memberships: {
        include: {
          household: {
            include: {
              todos: {
                where: {
                  isCompleted: false,
                  dueDate: { gte: start, lt: end },
                },
              },
              nurseryItems: {
                where: {
                  isCompleted: false,
                  date: { gte: start, lt: end },
                },
              },
              medicalSchedules: {
                where: {
                  isCompleted: false,
                  date: { gte: start, lt: end },
                },
              },
            },
          },
        },
      },
    },
  });

  const result: ReminderRunResult = {
    eligibleUsers: users.length,
    sent: 0,
    skipped: 0,
    failed: 0,
  };

  for (const user of users) {
    const items: ReminderItem[] = user.memberships.flatMap(({ household }) => [
      ...household.todos.map((item) => ({
        kind: "TODO" as const,
        title: item.title,
        householdName: household.name,
        date: item.dueDate!,
        includesTime: false,
      })),
      ...household.nurseryItems.map((item) => ({
        kind: "保育園" as const,
        title: item.title,
        householdName: household.name,
        date: item.date,
        includesTime: false,
      })),
      ...household.medicalSchedules.map((item) => ({
        kind: "病院" as const,
        title: item.title,
        householdName: household.name,
        date: item.date,
        includesTime: true,
      })),
    ]);

    if (items.length === 0 || !user.email) {
      result.skipped += 1;
      continue;
    }

    const delivery = await prisma.reminderDelivery.upsert({
      where: { userId_targetDate: { userId: user.id, targetDate: start } },
      create: { userId: user.id, targetDate: start },
      update: {},
    });
    if (delivery.sentAt) {
      result.skipped += 1;
      continue;
    }

    try {
      const email = buildReminderEmail({
        displayName: user.displayName,
        items,
        appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      });
      await sendReminderEmail({
        to: user.email,
        ...email,
        idempotencyKey: `due-reminder/${user.id}/${start.toISOString()}`,
      });
      await prisma.reminderDelivery.update({
        where: { id: delivery.id },
        data: { sentAt: new Date() },
      });
      result.sent += 1;
    } catch (error) {
      result.failed += 1;
      console.error("期限通知メールの送信に失敗しました。", error);
    }
  }

  return result;
}
