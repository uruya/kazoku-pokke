import "server-only";

import { randomUUID } from "node:crypto";
import { after } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPushNotification } from "@/lib/push-notifications";
import { sendReminderEmail } from "@/lib/resend";
import {
  buildFamilyChangeNotification,
  type FamilyChangeAction,
  type FamilyChangeKind,
} from "@/lib/family-notification-content";

type FamilyChange = {
  householdId: string;
  actorUserId: string;
  kind: FamilyChangeKind;
  action: FamilyChangeAction;
};

// Run only after the mutation succeeds; delivery failures must not undo a saved item.
export function notifyFamilyChange(change: FamilyChange) {
  after(async () => {
    try {
      await sendFamilyChangeNotification(change);
    } catch {
      console.error("家族共有通知の処理に失敗しました。");
    }
  });
}

export async function sendFamilyChangeNotification(change: FamilyChange) {
  const users = await prisma.user.findMany({
    where: {
      id: { not: change.actorUserId },
      memberships: { some: { householdId: change.householdId } },
      OR: [
        { emailReminderEnabled: true, email: { not: null } },
        { pushSubscriptions: { some: {} } },
      ],
    },
    include: { pushSubscriptions: true },
  });
  const payload = buildFamilyChangeNotification(change.kind, change.action);
  const eventId = randomUUID();
  const url = new URL(
    payload.url,
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ).toString();

  for (const user of users) {
    if (user.emailReminderEnabled && user.email) {
      try {
        await sendReminderEmail({
          to: user.email,
          subject: `【かぞくポッケ】${payload.body.split("。")[0]}`,
          text: `${payload.body}\n\n確認する：${url}\n\n通知設定はアプリの「その他」から変更できます。`,
          html: `<p>${payload.body}</p><p><a href="${url.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;")}">かぞくポッケで確認</a></p><p>通知設定はアプリの「その他」から変更できます。</p>`,
          idempotencyKey: `family-change/${eventId}/${user.id}`,
        });
      } catch {
        console.error("家族共有メールの送信に失敗しました。");
      }
    }
    for (const subscription of user.pushSubscriptions) {
      try {
        const status = await sendPushNotification(subscription, {
          ...payload,
          tag: `family-change-${eventId}`,
        });
        if (status === "expired") {
          await prisma.pushSubscription.deleteMany({
            where: { id: subscription.id, userId: user.id },
          });
        }
      } catch {
        console.error("家族共有Push通知の送信に失敗しました。");
      }
    }
  }
}
