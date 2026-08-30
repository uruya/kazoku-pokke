"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function updateNotificationSettings(formData: FormData) {
  const user = await requireUser();
  await prisma.user.update({
    where: { id: user.id },
    data: { emailReminderEnabled: formData.get("enabled") === "on" },
  });
  revalidatePath("/more");
}
