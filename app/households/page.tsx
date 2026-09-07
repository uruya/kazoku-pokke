import type { Metadata } from "next";
import {
  createHousehold,
  switchHousehold,
} from "@/app/actions/households";
import { revokeInvitation } from "@/app/actions/invitations";
import { FormPanel } from "@/components/forms/form-shell";
import { InviteLinkForm } from "@/components/invitations/invite-link-form";
import { PageHeader } from "@/components/page-header";
import { ConfirmActionButton } from "@/components/ui/action-buttons";
import { formatDateTime } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { requireHousehold } from "@/lib/session";

export const metadata: Metadata = { title: "家庭と家族" };
export const dynamic = "force-dynamic";

export default async function HouseholdsPage() {
  const context = await requireHousehold();
  const isOwner = context.membership.role === "OWNER";
  const invitations = isOwner
    ? await prisma.householdInvitation.findMany({
        where: {
          householdId: context.householdId,
          acceptedAt: null,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <main>
      <PageHeader
        title="家庭と家族"
        description="家庭の切り替えと、家族を招待するリンクを管理します。"
        backHref="/more"
      />
      <div className="mx-auto grid max-w-5xl gap-4 px-4 py-5 md:px-10">
        <section>
          <h2 className="mb-3 text-lg font-extrabold">利用できる家庭</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {context.memberships.map(({ household, role }) => {
              const active = household.id === context.householdId;
              return (
                <form
                  key={household.id}
                  action={switchHousehold.bind(null, household.id)}
                  className="rounded-2xl border border-[var(--line)] bg-white p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-extrabold">{household.name}</p>
                    <span className="rounded-full bg-[var(--surface)] px-2 py-1 text-xs font-bold text-[var(--muted)]">
                      {role === "OWNER" ? "管理者" : "家族"}
                    </span>
                  </div>
                  <button
                    disabled={active}
                    className="mt-3 min-h-11 rounded-xl bg-[var(--primary-soft)] px-4 text-sm font-extrabold text-[var(--primary)] disabled:bg-[var(--surface)] disabled:text-[var(--muted)]"
                  >
                    {active ? "現在の家庭" : "この家庭に切り替える"}
                  </button>
                </form>
              );
            })}
          </div>
        </section>

        {isOwner ? (
          <FormPanel title="家族を招待">
            <p className="mb-4 text-sm leading-6 text-[var(--muted)]">
              招待リンクを家族に送り、相手がメールでログインして承認すると同じ家庭へ参加できます。
            </p>
            <InviteLinkForm />
            {invitations.length > 0 ? (
              <div className="mt-5 border-t border-[var(--line)] pt-4">
                <h3 className="text-sm font-extrabold">承認待ちのリンク</h3>
                <div className="mt-2 grid gap-2">
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between gap-3 rounded-xl bg-[var(--surface)] p-3"
                    >
                      <p className="text-sm text-[var(--muted)]">
                        有効期限：{formatDateTime(invitation.expiresAt)}
                      </p>
                      <ConfirmActionButton
                        action={revokeInvitation.bind(null, invitation.id)}
                        buttonLabel="無効にする"
                        title="招待リンクを無効にしますか？"
                        description="このリンクを受け取った家族は、今後このリンクから参加できなくなります。"
                        confirmLabel="無効にする"
                        pendingLabel="無効化中…"
                        successMessage="招待リンクを無効にしました。"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </FormPanel>
        ) : (
          <section className="rounded-2xl border border-[var(--line)] bg-white p-4">
            <h2 className="font-extrabold">家族の招待</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              招待リンクは家庭の管理者が作成できます。
            </p>
          </section>
        )}

        <FormPanel title="別の家庭を追加">
          <form action={createHousehold}>
            <label className="block font-extrabold" htmlFor="householdName">
              家庭の表示名
            </label>
            <input
              id="householdName"
              name="householdName"
              required
              maxLength={60}
              placeholder="例：祖父母の家"
              className="mt-2 min-h-12 w-full rounded-xl border border-[var(--line)] bg-white px-3"
            />
            <button className="mt-4 min-h-12 rounded-xl bg-[var(--primary)] px-5 font-extrabold text-white">
              家庭を追加
            </button>
          </form>
        </FormPanel>
      </div>
    </main>
  );
}
