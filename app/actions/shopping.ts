"use server";

import { revalidatePath } from "next/cache";
import { SHOPPING_CATEGORIES, isOptionValue } from "@/lib/constants";
import { optionalText, requiredText } from "@/lib/form-data";
import { prisma } from "@/lib/prisma";
import { requireHousehold } from "@/lib/session";

function shoppingInput(formData: FormData) {
  const category = requiredText(formData, "category", 30);
  if (!isOptionValue(SHOPPING_CATEGORIES, category)) {
    throw new Error("カテゴリを正しく選択してください。");
  }
  return {
    name: requiredText(formData, "name"),
    category,
    note: optionalText(formData, "note"),
  };
}

function refreshShopping() {
  revalidatePath("/");
  revalidatePath("/shopping");
}

export async function createShoppingItem(formData: FormData) {
  const { householdId } = await requireHousehold();
  await prisma.shoppingItem.create({ data: { ...shoppingInput(formData), householdId } });
  refreshShopping();
}

export async function updateShoppingItem(id: string, formData: FormData) {
  const { householdId } = await requireHousehold();
  await prisma.shoppingItem.update({
    where: { id_householdId: { id, householdId } },
    data: shoppingInput(formData),
  });
  refreshShopping();
}

export async function toggleShoppingItem(id: string) {
  const { householdId } = await requireHousehold();
  const where = { id_householdId: { id, householdId } };
  const item = await prisma.shoppingItem.findUniqueOrThrow({ where });
  await prisma.shoppingItem.update({
    where,
    data: { isPurchased: !item.isPurchased },
  });
  refreshShopping();
}

export async function deleteShoppingItem(id: string) {
  const { householdId } = await requireHousehold();
  await prisma.shoppingItem.delete({ where: { id_householdId: { id, householdId } } });
  refreshShopping();
}
