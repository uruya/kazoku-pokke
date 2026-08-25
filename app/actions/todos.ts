"use server";

import { revalidatePath } from "next/cache";
import { TODO_CATEGORIES, isOptionValue } from "@/lib/constants";
import { dateFromInput } from "@/lib/date";
import { optionalText, requiredText } from "@/lib/form-data";
import { prisma } from "@/lib/prisma";
import { requireHousehold } from "@/lib/session";

function todoInput(formData: FormData) {
  const category = requiredText(formData, "category", 30);
  if (!isOptionValue(TODO_CATEGORIES, category)) {
    throw new Error("カテゴリを正しく選択してください。");
  }
  const dueDateValue = optionalText(formData, "dueDate", 10);

  return {
    title: requiredText(formData, "title"),
    category,
    dueDate: dueDateValue ? dateFromInput(dueDateValue) : null,
    note: optionalText(formData, "note"),
  };
}

function refreshTodos() {
  revalidatePath("/");
  revalidatePath("/todos");
}

export async function createTodo(formData: FormData) {
  const { householdId } = await requireHousehold();
  await prisma.todo.create({ data: { ...todoInput(formData), householdId } });
  refreshTodos();
}

export async function updateTodo(id: string, formData: FormData) {
  const { householdId } = await requireHousehold();
  await prisma.todo.update({ where: { id_householdId: { id, householdId } }, data: todoInput(formData) });
  refreshTodos();
}

export async function toggleTodo(id: string) {
  const { householdId } = await requireHousehold();
  const where = { id_householdId: { id, householdId } };
  const item = await prisma.todo.findUniqueOrThrow({ where });
  await prisma.todo.update({
    where,
    data: { isCompleted: !item.isCompleted },
  });
  refreshTodos();
}

export async function deleteTodo(id: string) {
  const { householdId } = await requireHousehold();
  await prisma.todo.delete({ where: { id_householdId: { id, householdId } } });
  refreshTodos();
}
