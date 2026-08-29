"use server";

import { redirect } from "next/navigation";
import { optionalText, requiredText } from "@/lib/form-data";
import { prisma } from "@/lib/prisma";
import {
  requireHousehold,
  requireUser,
  setActiveHouseholdCookie,
} from "@/lib/session";

export async function startUsingApp(formData: FormData) {
  const user = await requireUser();
  if (user.memberships.length > 0) redirect("/");

  const householdName = requiredText(formData, "householdName", 60);
  const displayName = optionalText(formData, "displayName", 60);
  const household = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: { displayName },
    });
    return tx.household.create({
      data: {
        name: householdName,
        members: {
          create: { userId: updatedUser.id, role: "OWNER" },
        },
      },
    });
  });

  await setActiveHouseholdCookie(household.id);
  redirect("/");
}

export async function createHousehold(formData: FormData) {
  const { userId } = await requireHousehold();
  const name = requiredText(formData, "householdName", 60);
  const household = await prisma.household.create({
    data: {
      name,
      members: { create: { userId, role: "OWNER" } },
    },
  });
  await setActiveHouseholdCookie(household.id);
  redirect("/");
}

export async function switchHousehold(householdId: string) {
  const user = await requireUser();
  const membership = await prisma.householdMember.findUnique({
    where: {
      householdId_userId: {
        householdId,
        userId: user.id,
      },
    },
  });
  if (!membership) {
    throw new Error("この家庭へ切り替える権限がありません。");
  }

  await setActiveHouseholdCookie(householdId);
  redirect("/");
}
