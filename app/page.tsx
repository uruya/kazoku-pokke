import Link from "next/link";
import { TODO_CATEGORIES, NURSERY_TYPES, optionLabel } from "@/lib/constants";
import {
  addDays,
  formatDate,
  formatDateTime,
  formatLongDate,
  startOfJapanDay,
} from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { requireHousehold } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { householdId, household } = await requireHousehold();
  const today = startOfJapanDay();
  const tomorrow = addDays(today, 1);
  const weekEnd = addDays(today, 7);

  const [
    todayTodos,
    nearTodos,
    nurserySchedules,
    medicalSchedules,
    shoppingItems,
    shoppingCount,
    nextMedical,
  ] = await prisma.$transaction([
    prisma.todo.findMany({
      where: {
        householdId,
        isCompleted: false,
        dueDate: { gte: today, lt: tomorrow },
      },
      orderBy: { createdAt: "asc" },
      take: 4,
    }),
    prisma.todo.findMany({
      where: {
        householdId,
        isCompleted: false,
        dueDate: { gte: tomorrow, lt: weekEnd },
      },
      orderBy: { dueDate: "asc" },
      take: 3,
    }),
    prisma.nurseryItem.findMany({
      where: {
        householdId,
        isCompleted: false,
        date: { gte: today, lt: weekEnd },
      },
      orderBy: { date: "asc" },
      take: 4,
    }),
    prisma.medicalSchedule.findMany({
      where: {
        householdId,
        isCompleted: false,
        date: { gte: today, lt: weekEnd },
      },
      orderBy: { date: "asc" },
      take: 3,
    }),
    prisma.shoppingItem.findMany({
      where: { householdId, isPurchased: false },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.shoppingItem.count({ where: { householdId, isPurchased: false } }),
    prisma.medicalSchedule.findFirst({
      where: { householdId, isCompleted: false, date: { gte: new Date() } },
      orderBy: { date: "asc" },
    }),
  ]);

  const weeklySchedules = [
    ...nurserySchedules.map((item) => ({
      id: item.id,
      title: item.title,
      date: item.date,
      meta: `保育園・${optionLabel(NURSERY_TYPES, item.type)}`,
      href: "/nursery",
      tone: "green",
    })),
    ...medicalSchedules.map((item) => ({
      id: item.id,
      title: item.title,
      date: item.date,
      meta: item.hospitalName ?? "病院",
      href: "/medical",
      tone: "yellow",
    })),
  ]
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 4);

  return (
    <main>
      <header className="bg-[var(--primary)] px-5 pb-8 pt-7 text-white md:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold text-white/75">
            {formatLongDate(today)}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
            {household.name}
          </h1>
          <p className="mt-1 text-sm text-white/80">今日も、ひとつずつ。</p>
          <div className="mt-5 rounded-2xl bg-white/12 p-4 ring-1 ring-white/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-white/70">今日やること</p>
                <p className="mt-1 text-lg font-extrabold">
                  あと {todayTodos.length}件
                </p>
              </div>
              <Link
                href="/todos"
                prefetch
                className="flex min-h-11 items-center rounded-xl bg-white px-4 text-sm font-extrabold text-[var(--primary)]"
              >
                一覧を見る
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-4 px-4 pb-10 pt-4 md:grid-cols-2 md:px-10">
        <section className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-[0_5px_18px_rgba(43,58,53,0.06)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold">今日のTODO</h2>
            <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-bold text-[#a64f31]">
              {todayTodos.length}件
            </span>
          </div>
          {todayTodos.length === 0 ? (
            <p className="mt-4 rounded-xl bg-[var(--surface)] p-4 text-sm font-bold text-[var(--muted)]">
              今日が期限のTODOはありません
            </p>
          ) : (
            <div className="mt-3 divide-y divide-[var(--line)]">
              {todayTodos.map((todo) => (
                <Link
                  href="/todos"
                  prefetch
                  key={todo.id}
                  className="flex min-h-14 items-center gap-3 py-2"
                >
                  <span className="h-6 w-6 rounded-full border-2 border-[var(--primary)]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{todo.title}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {optionLabel(TODO_CATEGORIES, todo.category)}・今日
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[var(--line)] bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold">期限が近いTODO</h2>
            <Link
              href="/todos"
              prefetch
              className="min-h-11 py-2 text-sm font-bold text-[var(--primary)]"
            >
              すべて見る
            </Link>
          </div>
          {nearTodos.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--muted)]">
              7日以内のTODOはありません
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-[var(--line)]">
              {nearTodos.map((todo) => (
                <li key={todo.id} className="flex gap-3 py-2.5">
                  <span className="min-w-16 text-sm font-extrabold text-[#9a4f34]">
                    {todo.dueDate ? formatDate(todo.dueDate) : ""}
                  </span>
                  <span className="font-bold">{todo.title}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-[var(--line)] bg-white p-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold">今週の予定</h2>
            <Link
              href="/nursery"
              prefetch
              className="min-h-11 py-2 text-sm font-bold text-[var(--primary)]"
            >
              保育園を見る
            </Link>
          </div>
          {weeklySchedules.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--muted)]">
              今週の予定はありません
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {weeklySchedules.map((item) => (
                <Link
                  href={item.href}
                  prefetch
                  key={`${item.href}-${item.id}`}
                  className={`flex gap-3 rounded-xl p-3 ${
                    item.tone === "green"
                      ? "bg-[var(--primary-soft)]"
                      : "bg-[var(--warning-soft)]"
                  }`}
                >
                  <div
                    className={`w-16 shrink-0 text-sm font-extrabold ${
                      item.tone === "green"
                        ? "text-[var(--primary)]"
                        : "text-[#87601c]"
                    }`}
                  >
                    {formatDate(item.date)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-extrabold">{item.title}</p>
                    <p className="truncate text-xs text-[var(--muted)]">
                      {item.meta}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[var(--line)] bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold">買うもの</h2>
            <Link
              href="/shopping"
              prefetch
              className="min-h-11 py-2 text-sm font-bold text-[var(--primary)]"
            >
              リストへ
            </Link>
          </div>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {shoppingItems.length > 0
              ? `${shoppingItems.map((item) => item.name).join("、")}${
                  shoppingCount > shoppingItems.length
                    ? ` ほか${shoppingCount - shoppingItems.length}件`
                    : ""
                }`
              : "買うものはありません"}
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--line)] bg-white p-4">
          <p className="text-xs font-bold text-[var(--muted)]">次回の病院予定</p>
          {nextMedical ? (
            <Link
              href="/medical"
              prefetch
              className="mt-2 flex items-center gap-3"
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-xl"
                aria-hidden="true"
              >
                ＋
              </span>
              <div>
                <h2 className="font-extrabold">{nextMedical.title}</h2>
                <p className="text-sm text-[var(--muted)]">
                  {formatDateTime(nextMedical.date)}
                </p>
              </div>
            </Link>
          ) : (
            <p className="mt-2 text-sm text-[var(--muted)]">
              次回の予定はありません
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
