"use server";

import { revalidatePath } from "next/cache";
import { dateFromInput } from "@/lib/date";
import { optionalText, requiredText } from "@/lib/form-data";
import { prisma } from "@/lib/prisma";
import { requireHousehold } from "@/lib/session";

function childInput(formData: FormData) {
  return {
    nickname: requiredText(formData, "nickname", 60),
    birthDate: dateFromInput(requiredText(formData, "birthDate", 10)),
    clothingSize: optionalText(formData, "clothingSize", 30),
    shoeSize: optionalText(formData, "shoeSize", 30),
    note: optionalText(formData, "note"),
  };
}

function refreshChildren() {
  revalidatePath("/children");
  revalidatePath("/more");
}

export async function createChild(formData: FormData) {
  const { householdId } = await requireHousehold();
  await prisma.child.create({ data: { ...childInput(formData), householdId } });
  refreshChildren();
}

export async function updateChild(id: string, formData: FormData) {
  const { householdId } = await requireHousehold();
  await prisma.child.update({ where: { id_householdId: { id, householdId } }, data: childInput(formData) });
  refreshChildren();
}

export async function deleteChild(id: string) {
  const { householdId } = await requireHousehold();
  await prisma.child.delete({ where: { id_householdId: { id, householdId } } });
  refreshChildren();
}
