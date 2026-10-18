import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const model = () => ({ create: vi.fn(), update: vi.fn(), delete: vi.fn(), findUniqueOrThrow: vi.fn() });
  return { todo: model(), nurseryItem: model(), medicalSchedule: model(), notify: vi.fn(), requireHousehold: vi.fn() };
});
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/session", () => ({ requireHousehold: mocks.requireHousehold }));
vi.mock("@/lib/prisma", () => ({ prisma: mocks }));
vi.mock("@/lib/family-notifications", () => ({ notifyFamilyChange: mocks.notify }));
vi.mock("@/lib/family-notification-content", async () => import("../lib/family-notification-content"));
vi.mock("@/lib/date", async () => import("../lib/date"));
vi.mock("@/lib/constants", async () => import("../lib/constants"));
vi.mock("@/lib/form-data", async () => import("../lib/form-data"));
import { createTodo, updateTodo, deleteTodo, toggleTodo } from "../app/actions/todos";
import { createNurseryItem, updateNurseryItem, deleteNurseryItem, toggleNurseryItem } from "../app/actions/nursery";
import { createMedicalSchedule, updateMedicalSchedule, deleteMedicalSchedule, toggleMedicalSchedule } from "../app/actions/medical";
import { dateFromInput, dateTimeFromInput } from "../lib/date";

const cases = [
  { kind: "TODO", model: mocks.todo, create: createTodo, update: updateTodo, remove: deleteTodo, toggle: toggleTodo,
    input: { title: "予定", category: "OTHER", dueDate: "2026-10-19", note: "新しいメモ" },
    previous: { title: "予定", category: "OTHER", dueDate: dateFromInput("2026-10-19"), note: "古いメモ", isCompleted: false } },
  { kind: "保育園", model: mocks.nurseryItem, create: createNurseryItem, update: updateNurseryItem, remove: deleteNurseryItem, toggle: toggleNurseryItem,
    input: { title: "予定", type: "EVENT", date: "2026-10-19", note: "新しいメモ" },
    previous: { title: "予定", type: "EVENT", date: dateFromInput("2026-10-19"), note: "古いメモ", isCompleted: false } },
  { kind: "病院", model: mocks.medicalSchedule, create: createMedicalSchedule, update: updateMedicalSchedule, remove: deleteMedicalSchedule, toggle: toggleMedicalSchedule,
    input: { title: "予定", date: "2026-10-19T10:00", hospitalName: "病院", note: "新しいメモ" },
    previous: { title: "予定", date: dateTimeFromInput("2026-10-19T10:00"), hospitalName: "病院", note: "古いメモ", isCompleted: false } },
];

describe.each(cases)("$kindの保存と家族通知", (entry) => {
  const form = () => {
    const data = new FormData();
    Object.entries(entry.input).forEach(([key, value]) => data.set(key, value));
    return data;
  };
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.requireHousehold.mockResolvedValue({ householdId: "family", userId: "actor" });
    entry.model.findUniqueOrThrow.mockResolvedValue(entry.previous);
  });
  it("追加と削除が成功した後に本人以外へ通知する", async () => {
    await entry.create(form());
    expect(mocks.notify).toHaveBeenCalledWith({ householdId: "family", actorUserId: "actor", kind: entry.kind, action: "added" });
    expect(entry.model.create.mock.invocationCallOrder[0]).toBeLessThan(mocks.notify.mock.invocationCallOrder[0]);
    await entry.remove("item");
    expect(entry.model.delete).toHaveBeenCalledWith({ where: { id_householdId: { id: "item", householdId: "family" } } });
    expect(mocks.notify).toHaveBeenLastCalledWith({ householdId: "family", actorUserId: "actor", kind: entry.kind, action: "deleted" });
  });
  it("メモのみの編集と完了操作では通知しない", async () => {
    await entry.update("item", form());
    await entry.toggle("item");
    expect(mocks.notify).not.toHaveBeenCalled();
  });
  it("重要な変更時に通知し、家庭境界を付けて読み書きする", async () => {
    const data = form();
    data.set("title", "変更後");
    await entry.update("item", data);
    expect(entry.model.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id_householdId: { id: "item", householdId: "family" } } });
    expect(entry.model.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id_householdId: { id: "item", householdId: "family" } } }));
    expect(mocks.notify).toHaveBeenCalledWith({ householdId: "family", actorUserId: "actor", kind: entry.kind, action: "updated" });
  });
  it("保存失敗時には通知を予約しない", async () => {
    entry.model.create.mockRejectedValue(new Error("write failed"));
    await expect(entry.create(form())).rejects.toThrow("write failed");
    expect(mocks.notify).not.toHaveBeenCalled();
  });
});
