import { PrismaClient } from "@prisma/client";
import { afterAll, describe, expect, it } from "vitest";

const prisma = new PrismaClient();
const householdIds: string[] = [];

afterAll(async () => {
  await prisma.household.deleteMany({ where: { id: { in: householdIds } } });
  await prisma.$disconnect();
});

describe("家庭テナント境界", () => {
  it("家庭IDで一覧を分離し、別家庭の複合キーでは更新できない", async () => {
    const first = await prisma.household.create({ data: { name: "テスト家庭A" } });
    const second = await prisma.household.create({ data: { name: "テスト家庭B" } });
    householdIds.push(first.id, second.id);
    const firstTodo = await prisma.todo.create({ data: { householdId: first.id, title: "家庭AのTODO" } });
    await prisma.todo.create({ data: { householdId: second.id, title: "家庭BのTODO" } });

    const visibleToFirst = await prisma.todo.findMany({ where: { householdId: first.id } });
    expect(visibleToFirst.map((todo) => todo.title)).toEqual(["家庭AのTODO"]);
    await expect(
      prisma.todo.update({
        where: { id_householdId: { id: firstTodo.id, householdId: second.id } },
        data: { title: "変更されない" },
      }),
    ).rejects.toThrow();
  });
});
