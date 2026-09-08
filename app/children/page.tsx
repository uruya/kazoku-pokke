import type { Metadata } from "next";
import {
  createChild,
  deleteChild,
  updateChild,
} from "@/app/actions/children";
import { ChildForm } from "@/components/forms/child-form";
import { FormPanel } from "@/components/forms/form-shell";
import { PageHeader } from "@/components/page-header";
import { DeleteButton } from "@/components/ui/action-buttons";
import { EmptyState } from "@/components/ui/empty-state";
import { formatAge, formatLongDate } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { requireHousehold } from "@/lib/session";

export const metadata: Metadata = { title: "子どもプロフィール" };
export const dynamic = "force-dynamic";

export default async function ChildrenPage() {
  const { householdId } = await requireHousehold();
  const children = await prisma.child.findMany({ where: { householdId }, orderBy: { createdAt: "asc" } });

  return (
    <main>
      <PageHeader
        title="子どもプロフィール"
        description="サイズ確認に必要な最小限の情報だけを保存します。"
        backHref="/more"
      />
      <div className="mx-auto grid max-w-5xl gap-4 px-4 py-5 md:px-10">
        <div className="rounded-xl bg-[var(--warning-soft)] p-3 text-sm leading-6 text-[#72511a]">
          住所、写真、詳細な医療情報などは入力しないでください。
        </div>
        <FormPanel title="子どもを追加">
          <ChildForm action={createChild} />
        </FormPanel>
        <section aria-labelledby="children-list-title">
          <h2 id="children-list-title" className="mb-3 text-lg font-extrabold">
            プロフィール
          </h2>
          {children.length === 0 ? (
            <EmptyState message="子どものプロフィールはまだありません" />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {children.map((child) => (
                <article
                  key={child.id}
                  className="rounded-2xl border border-[var(--line)] bg-white p-4"
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-xl font-black text-[var(--primary)]"
                    >
                      {child.nickname.slice(0, 1)}
                    </span>
                    <div>
                      <h3 className="text-lg font-extrabold">
                        {child.nickname}
                      </h3>
                      <p className="text-sm text-[var(--muted)]">
                        {formatAge(child.birthDate)}
                      </p>
                    </div>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-[var(--surface)] p-3">
                      <dt className="text-xs font-bold text-[var(--muted)]">
                        服サイズ
                      </dt>
                      <dd className="mt-1 font-extrabold">
                        {child.clothingSize ?? "未入力"}
                      </dd>
                    </div>
                    <div className="rounded-xl bg-[var(--surface)] p-3">
                      <dt className="text-xs font-bold text-[var(--muted)]">
                        靴サイズ
                      </dt>
                      <dd className="mt-1 font-extrabold">
                        {child.shoeSize ?? "未入力"}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-3 text-xs text-[var(--muted)]">
                    生年月日：{formatLongDate(child.birthDate)}
                  </p>
                  {child.note ? (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--muted)]">
                      {child.note}
                    </p>
                  ) : null}
                  <div className="mt-2 flex items-start gap-2 border-t border-[var(--line)] pt-2">
                    <details className="min-w-0 flex-1">
                      <summary className="flex min-h-11 cursor-pointer items-center text-sm font-bold text-[var(--primary)]">
                        編集する
                      </summary>
                      <div className="mt-2 rounded-xl bg-[var(--surface)] p-3">
                        <ChildForm
                          action={updateChild.bind(null, child.id)}
                          item={child}
                          submitLabel="変更を保存"
                        />
                      </div>
                    </details>
                    <DeleteButton action={deleteChild.bind(null, child.id)} />
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
