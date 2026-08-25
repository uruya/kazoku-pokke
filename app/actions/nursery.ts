"use server";

import { revalidatePath } from "next/cache";
import { NURSERY_TYPES, isOptionValue } from "@/lib/constants";
import { dateFromInput } from "@/lib/date";
import { optionalText, requiredText } from "@/lib/form-data";
import { prisma } from "@/lib/prisma";
import { requireHousehold } from "@/lib/session";

function nurseryInput(formData: FormData) {
  const type = requiredText(formData, "type", 30);
  if (!isOptionValue(NURSERY_TYPES, type)) {
    throw new Error("種類を正しく選択してください。");
  }
  return {
    title: requiredText(formData, "title"),
    type,
    date: dateFromInput(requiredText(formData, "date", 10)),
    note: optionalText(formData, "note"),
  };
}

function refreshNursery() {
  revalidatePath("/");
  revalidatePath("/nursery");
}

export async function createNurseryItem(formData: FormData) {
  const { householdId } = await requireHousehold();
  await prisma.nurseryItem.create({ data: { ...nurseryInput(formData), householdId } });
  refreshNursery();
}

export async function updateNurseryItem(id: string, formData: FormData) {
  const { householdId } = await requireHousehold();
  await prisma.nurseryItem.update({
    where: { id_householdId: { id, householdId } },
    data: nurseryInput(formData),
  });
  refreshNursery();
}

export async function toggleNurseryItem(id: string) {
  const { householdId } = await requireHousehold();
  const where = { id_householdId: { id, householdId } };
  const item = await prisma.nurseryItem.findUniqueOrThrow({ where });
  await prisma.nurseryItem.update({
    where,
    data: { isCompleted: !item.isCompleted },
  });
  refreshNursery();
}

export async function deleteNurseryItem(id: string) {
  const { householdId } = await requireHousehold();
  await prisma.nurseryItem.delete({ where: { id_householdId: { id, householdId } } });
  refreshNursery();
}
