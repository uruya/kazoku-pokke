"use server";

import { prisma } from "@/lib/prisma";
import { sendPushNotification } from "@/lib/push-notifications";
import { requireUser } from "@/lib/session";

export type SerializedPushSubscription = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export type PushActionResult = {
  success: boolean;
  message: string;
};

function validSubscription(
  value: SerializedPushSubscription,
): value is SerializedPushSubscription {
  if (
    typeof value?.endpoint !== "string" ||
    typeof value?.keys?.p256dh !== "string" ||
    typeof value?.keys?.auth !== "string"
  ) {
    return false;
  }

  try {
    const endpoint = new URL(value.endpoint);
    return (
      endpoint.protocol === "https:" &&
      value.endpoint.length <= 4096 &&
      value.keys.p256dh.length > 0 &&
      value.keys.p256dh.length <= 2048 &&
      value.keys.auth.length > 0 &&
      value.keys.auth.length <= 2048
    );
  } catch {
    return false;
  }
}

export async function savePushSubscription(
  subscription: SerializedPushSubscription,
): Promise<PushActionResult> {
  const user = await requireUser();
  if (!validSubscription(subscription)) {
    return { success: false, message: "通知端末の情報が正しくありません。" };
  }

  try {
    await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      create: {
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userId: user.id,
      },
      update: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userId: user.id,
        lastReminderDate: null,
      },
    });
    return { success: true, message: "この端末のスマホ通知をONにしました。" };
  } catch (error) {
    console.error("Push購読情報の保存に失敗しました。", error);
    return { success: false, message: "通知設定を保存できませんでした。" };
  }
}

export async function removePushSubscription(
  endpoint: string,
): Promise<PushActionResult> {
  const user = await requireUser();
  if (typeof endpoint !== "string" || endpoint.length > 4096) {
    return { success: false, message: "通知端末の情報が正しくありません。" };
  }

  try {
    await prisma.pushSubscription.deleteMany({
      where: { endpoint, userId: user.id },
    });
    return { success: true, message: "この端末のスマホ通知をOFFにしました。" };
  } catch (error) {
    console.error("Push購読情報の削除に失敗しました。", error);
    return { success: false, message: "通知設定を変更できませんでした。" };
  }
}

export async function sendTestPushNotification(
  endpoint: string,
): Promise<PushActionResult> {
  const user = await requireUser();
  const subscription = await prisma.pushSubscription.findFirst({
    where: { endpoint, userId: user.id },
  });
  if (!subscription) {
    return { success: false, message: "この端末の通知設定が見つかりません。" };
  }

  try {
    const result = await sendPushNotification(subscription, {
      title: "かぞくポッケ",
      body: "スマホ通知の準備ができました。",
      url: "/",
    });
    if (result === "expired") {
      await prisma.pushSubscription.delete({ where: { id: subscription.id } });
      return {
        success: false,
        message: "通知設定の期限が切れました。もう一度ONにしてください。",
      };
    }
    return { success: true, message: "テスト通知を送りました。" };
  } catch (error) {
    console.error("Pushテスト通知の送信に失敗しました。", error);
    return { success: false, message: "テスト通知を送れませんでした。" };
  }
}
