"use server";

import { revalidatePath } from "next/cache";
import { hasImportantChanges } from "@/lib/family-notification-content";
import { notifyFamilyChange } from "@/lib/family-notifications";
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
  const { householdId, userId } = await requireHousehold();
  await prisma.medicalSchedule.create({ data: { ...medicalInput(formData), householdId } });
  notifyFamilyChange({ householdId, actorUserId: userId, kind: "病院", action: "added" });
  refreshMedical();
}

export async function updateMedicalSchedule(id: string, formData: FormData) {
  const { householdId, userId } = await requireHousehold();
  const where = { id_householdId: { id, householdId } };
  const data = medicalInput(formData);
  const previous = await prisma.medicalSchedule.findUniqueOrThrow({ where });
  await prisma.medicalSchedule.update({ where, data });
  if (hasImportantChanges(previous, data, ["title", "date", "hospitalName"])) {
    notifyFamilyChange({ householdId, actorUserId: userId, kind: "病院", action: "updated" });
  }
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
  const { householdId, userId } = await requireHousehold();
  await prisma.medicalSchedule.delete({ where: { id_householdId: { id, householdId } } });
  notifyFamilyChange({ householdId, actorUserId: userId, kind: "病院", action: "deleted" });
  refreshMedical();
}
