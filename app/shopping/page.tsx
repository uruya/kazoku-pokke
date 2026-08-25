import type { Metadata } from "next";
import {
  createShoppingItem,
  deleteShoppingItem,
  toggleShoppingItem,
  updateShoppingItem,
} from "@/app/actions/shopping";
import { FormPanel } from "@/components/forms/form-shell";
import { ShoppingForm } from "@/components/forms/shopping-form";
import { PageHeader } from "@/components/page-header";
import {
  DeleteButton,
  ToggleButton,
} from "@/components/ui/action-buttons";
import { EmptyState } from "@/components/ui/empty-state";
import { SHOPPING_CATEGORIES, optionLabel } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { requireHousehold } from "@/lib/session";

export const metadata: Metadata = { title: "買い物" };
export const dynamic = "force-dynamic";

export default async function ShoppingPage() {
  const { householdId } = await requireHousehold();
  const items = await prisma.shoppingItem.findMany({
    where: { householdId },
    orderBy: [{ isPurchased: "asc" }, { createdAt: "desc" }],
  });

  const remaining = items.filter((item) => !item.isPurchased).length;

  return (
    <main>
      <PageHeader
        title="買い物"
        description={`買うものはあと ${remaining}件。買ったら丸をタップします。`}
      />
      <div className="mx-auto grid max-w-5xl gap-4 px-4 py-5 md:px-10">
        <FormPanel title="買うものを追加">
          <ShoppingForm action={createShoppingItem} />
        </FormPanel>
        <section aria-labelledby="shopping-list-title">
          <h2 id="shopping-list-title" className="mb-3 text-lg font-extrabold">
            買い物リスト
          </h2>
          {items.length === 0 ? (
            <EmptyState message="買うものはありません" />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((item) => (
                <article
                  key={item.id}
                  className={`rounded-2xl border border-[var(--line)] bg-white p-4 ${
                    item.isPurchased ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <ToggleButton
                      action={toggleShoppingItem.bind(null, item.id)}
                      completed={item.isPurchased}
                      label={
                        item.isPurchased
                          ? `${item.name}を未購入に戻す`
                          : `${item.name}を購入済みにする`
                      }
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold text-[var(--primary)]">
                        {optionLabel(SHOPPING_CATEGORIES, item.category)}
                      </p>
                      <h3
                        className={`mt-0.5 font-extrabold ${
                          item.isPurchased ? "line-through" : ""
                        }`}
                      >
                        {item.name}
                      </h3>
                      {item.note ? (
                        <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--muted)]">
                          {item.note}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center border-t border-[var(--line)] pt-2">
                    <details className="flex-1">
                      <summary className="flex min-h-11 cursor-pointer items-center text-sm font-bold text-[var(--primary)]">
                        編集する
                      </summary>
                      <div className="mt-2 rounded-xl bg-[var(--surface)] p-3">
                        <ShoppingForm
                          action={updateShoppingItem.bind(null, item.id)}
                          item={item}
                          submitLabel="変更を保存"
                        />
                      </div>
                    </details>
                    <DeleteButton
                      action={deleteShoppingItem.bind(null, item.id)}
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
