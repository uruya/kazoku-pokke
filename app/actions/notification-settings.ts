"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export type NotificationSettingsActionState = {
  status: "idle" | "success" | "error";
  enabled: boolean;
  message?: string;
};

export async function updateNotificationSettings(
  _previousState: NotificationSettingsActionState,
  formData: FormData,
): Promise<NotificationSettingsActionState> {
  const user = await requireUser();
  const enabled = formData.get("enabled") === "on";

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { emailReminderEnabled: enabled },
    });
    revalidatePath("/more");

    return {
      status: "success",
      enabled,
      message: enabled
        ? "前日メール通知をONにしました。"
        : "前日メール通知をOFFにしました。",
    };
  } catch (error) {
    console.error("通知設定の保存に失敗しました", error);
    return {
      status: "error",
      enabled: user.emailReminderEnabled,
      message: "保存できませんでした。時間をおいてもう一度お試しください。",
    };
  }
}
