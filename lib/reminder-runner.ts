import "server-only";

import { prisma } from "@/lib/prisma";
import { sendPushNotification } from "@/lib/push-notifications";
import {
  buildReminderEmail,
  buildReminderPush,
  reminderWindow,
  type ReminderItem,
} from "@/lib/reminders";
import { sendReminderEmail } from "@/lib/resend";

export type ReminderRunResult = {
  eligibleUsers: number;
  sent: number;
  emailSent: number;
  pushSent: number;
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
      memberships: { some: {} },
      OR: [
        { emailReminderEnabled: true, email: { not: null } },
        { pushSubscriptions: { some: {} } },
      ],
    },
    include: {
      pushSubscriptions: true,
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
    emailSent: 0,
    pushSent: 0,
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

    if (items.length === 0) {
      result.skipped += 1;
      continue;
    }

    if (user.emailReminderEnabled && user.email) {
      const delivery = await prisma.reminderDelivery.upsert({
        where: { userId_targetDate: { userId: user.id, targetDate: start } },
        create: { userId: user.id, targetDate: start },
        update: {},
      });
      if (delivery.sentAt) {
        result.skipped += 1;
      } else {
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
          result.emailSent += 1;
          result.sent += 1;
        } catch (error) {
          result.failed += 1;
          console.error("期限通知メールの送信に失敗しました。", error);
        }
      }
    }

    const payload = buildReminderPush(items);
    for (const subscription of user.pushSubscriptions) {
      if (
        subscription.lastReminderDate &&
        subscription.lastReminderDate.getTime() >= start.getTime()
      ) {
        result.skipped += 1;
        continue;
      }

      try {
        const status = await sendPushNotification(subscription, payload);
        if (status === "expired") {
          await prisma.pushSubscription.delete({ where: { id: subscription.id } });
          result.skipped += 1;
          continue;
        }
        await prisma.pushSubscription.update({
          where: { id: subscription.id },
          data: { lastReminderDate: start },
        });
        result.pushSent += 1;
        result.sent += 1;
      } catch (error) {
        result.failed += 1;
        console.error("期限前Push通知の送信に失敗しました。", error);
      }
    }
  }

  return result;
}
