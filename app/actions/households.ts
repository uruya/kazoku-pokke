"use server";

import { redirect } from "next/navigation";
import { optionalText, requiredText } from "@/lib/form-data";
import { prisma } from "@/lib/prisma";
import { createSessionToken, getCurrentUser, requireHousehold, sessionExpiresAt, setActiveHouseholdCookie, setSessionCookies } from "@/lib/session";

export async function startUsingApp(formData: FormData) {
  if (await getCurrentUser()) redirect("/");
  const householdName = requiredText(formData, "householdName", 60);
  const displayName = optionalText(formData, "displayName", 60);
  const { token, tokenHash } = createSessionToken();
  const expiresAt = sessionExpiresAt();
  const result = await prisma.$transaction(async (tx) => {
    const legacyHousehold = await tx.household.findFirst({
      where: { id: "legacy-household", members: { none: {} } },
      orderBy: { createdAt: "asc" },
    });
    const user = await tx.user.create({ data: { displayName } });
    const household = legacyHousehold
      ? await tx.household.update({ where: { id: legacyHousehold.id }, data: { name: householdName } })
      : await tx.household.create({ data: { name: householdName } });
    await tx.householdMember.create({ data: { householdId: household.id, userId: user.id, role: "OWNER" } });
    await tx.session.create({ data: { userId: user.id, tokenHash, expiresAt } });
    return household;
  });
  await setSessionCookies(token, result.id, expiresAt);
  redirect("/");
}

export async function createHousehold(formData: FormData) {
  const { userId } = await requireHousehold();
  const name = requiredText(formData, "householdName", 60);
  const household = await prisma.household.create({ data: { name, members: { create: { userId, role: "OWNER" } } } });
  await setActiveHouseholdCookie(household.id);
  redirect("/");
}

export async function switchHousehold(householdId: string) {
  const { userId } = await requireHousehold();
  const membership = await prisma.householdMember.findUnique({ where: { householdId_userId: { householdId, userId } } });
  if (!membership) throw new Error("この家庭へ切り替える権限がありません。");
  await setActiveHouseholdCookie(householdId);
  redirect("/");
}
