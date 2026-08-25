"use server";

import { revalidatePath } from "next/cache";
import { dateTimeFromInput } from "@/lib/date";
import { optionalText, requiredText } from "@/lib/form-data";
import { prisma } from "@/lib/prisma";
import { requireHousehold } from "@/lib/session";

function medicalInput(formData: FormData) {
  return {
    title: requiredText(formData, "title"),
    date: dateTimeFromInput(requiredText(formData, "date", 16)),
    hospitalName: optionalText(formData, "hospitalName", 120),
    note: optionalText(formData, "note"),
  };
}

function refreshMedical() {
  revalidatePath("/");
  revalidatePath("/medical");
  revalidatePath("/more");
}

export async function createMedicalSchedule(formData: FormData) {
  const { householdId } = await requireHousehold();
  await prisma.medicalSchedule.create({ data: { ...medicalInput(formData), householdId } });
  refreshMedical();
}

export async function updateMedicalSchedule(id: string, formData: FormData) {
  const { householdId } = await requireHousehold();
  await prisma.medicalSchedule.update({
    where: { id_householdId: { id, householdId } },
    data: medicalInput(formData),
  });
  refreshMedical();
}

export async function toggleMedicalSchedule(id: string) {
  const { householdId } = await requireHousehold();
  const where = { id_householdId: { id, householdId } };
  const item = await prisma.medicalSchedule.findUniqueOrThrow({
    where,
  });
  await prisma.medicalSchedule.update({
    where,
    data: { isCompleted: !item.isCompleted },
  });
  refreshMedical();
}

export async function deleteMedicalSchedule(id: string) {
  const { householdId } = await requireHousehold();
  await prisma.medicalSchedule.delete({ where: { id_householdId: { id, householdId } } });
  refreshMedical();
}
