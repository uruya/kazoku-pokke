import type { Metadata } from "next";
import { createHousehold, switchHousehold } from "@/app/actions/households";
import { FormPanel } from "@/components/forms/form-shell";
import { PageHeader } from "@/components/page-header";
import { requireHousehold } from "@/lib/session";

export const metadata: Metadata = { title: "家庭の切り替え" };
export const dynamic = "force-dynamic";

export default async function HouseholdsPage() {
  const context = await requireHousehold();
  return (
    <main>
      <PageHeader title="家庭の切り替え" description="家庭ごとにTODOや予定、プロフィールを分けて管理します。" backHref="/more" />
      <div className="mx-auto grid max-w-5xl gap-4 px-4 py-5 md:px-10">
        <section>
          <h2 className="mb-3 text-lg font-extrabold">利用できる家庭</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {context.memberships.map(({ household }) => {
              const active = household.id === context.householdId;
              return (
                <form key={household.id} action={switchHousehold.bind(null, household.id)} className="rounded-2xl border border-[var(--line)] bg-white p-4">
                  <p className="font-extrabold">{household.name}</p>
                  <button disabled={active} className="mt-3 min-h-11 rounded-xl bg-[var(--primary-soft)] px-4 text-sm font-extrabold text-[var(--primary)] disabled:bg-[var(--surface)] disabled:text-[var(--muted)]">{active ? "現在の家庭" : "この家庭に切り替える"}</button>
                </form>
              );
            })}
          </div>
        </section>
        <FormPanel title="別の家庭を追加">
          <form action={createHousehold}>
            <label className="block font-extrabold" htmlFor="householdName">家庭の表示名</label>
            <input id="householdName" name="householdName" required maxLength={60} placeholder="例：祖父母の家" className="mt-2 min-h-12 w-full rounded-xl border border-[var(--line)] bg-white px-3" />
            <button className="mt-4 min-h-12 rounded-xl bg-[var(--primary)] px-5 font-extrabold text-white">家庭を追加</button>
          </form>
        </FormPanel>
      </div>
    </main>
  );
}
