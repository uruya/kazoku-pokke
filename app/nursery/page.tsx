import type { Metadata } from "next";
import {
  createNurseryItem,
  deleteNurseryItem,
  toggleNurseryItem,
  updateNurseryItem,
} from "@/app/actions/nursery";
import { NurseryForm } from "@/components/forms/nursery-form";
import { FormPanel } from "@/components/forms/form-shell";
import { PageHeader } from "@/components/page-header";
import {
  DeleteButton,
  ToggleButton,
} from "@/components/ui/action-buttons";
import { EmptyState } from "@/components/ui/empty-state";
import { NURSERY_TYPES, optionLabel } from "@/lib/constants";
import { formatDate } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { requireHousehold } from "@/lib/session";

export const metadata: Metadata = { title: "保育園" };
export const dynamic = "force-dynamic";

export default async function NurseryPage() {
  const { householdId } = await requireHousehold();
  const items = await prisma.nurseryItem.findMany({
    where: { householdId },
    orderBy: [{ isCompleted: "asc" }, { date: "asc" }],
  });

  return (
    <main>
      <PageHeader
        title="保育園"
        description="行事・提出物・持ち物を、期限順にまとめて確認できます。"
      />
      <div className="mx-auto grid max-w-5xl gap-4 px-4 py-5 md:px-10">
        <FormPanel title="保育園の予定を追加">
          <NurseryForm action={createNurseryItem} />
        </FormPanel>

        <section aria-labelledby="nursery-list-title">
          <div className="mb-3 flex items-end justify-between">
            <h2 id="nursery-list-title" className="text-lg font-extrabold">
              予定一覧
            </h2>
            <p className="text-xs font-bold text-[var(--muted)]">
              未完了 {items.filter((item) => !item.isCompleted).length}件
            </p>
          </div>
          {items.length === 0 ? (
            <EmptyState message="保育園の予定はまだありません" />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((item) => (
                <article
                  key={item.id}
                  className={`rounded-2xl border border-[var(--line)] bg-white p-4 ${
                    item.isCompleted ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <ToggleButton
                      action={toggleNurseryItem.bind(null, item.id)}
                      completed={item.isCompleted}
                      label={
                        item.isCompleted
                          ? `${item.title}を未完了に戻す`
                          : `${item.title}を完了にする`
                      }
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold text-[var(--primary)]">
                        {optionLabel(NURSERY_TYPES, item.type)}
                      </p>
                      <h3
                        className={`mt-0.5 font-extrabold leading-6 ${
                          item.isCompleted ? "line-through" : ""
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm font-bold text-[#9a4f34]">
                        {formatDate(item.date)}
                      </p>
                      {item.note ? (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--muted)]">
                          {item.note}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-end border-t border-[var(--line)] pt-2">
                    <details className="group flex-1">
                      <summary className="flex min-h-11 cursor-pointer items-center text-sm font-bold text-[var(--primary)]">
                        編集する
                      </summary>
                      <div className="mt-2 rounded-xl bg-[var(--surface)] p-3">
                        <NurseryForm
                          action={updateNurseryItem.bind(null, item.id)}
                          item={item}
                          submitLabel="変更を保存"
                        />
                      </div>
                    </details>
                    <DeleteButton
                      action={deleteNurseryItem.bind(null, item.id)}
                    />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
