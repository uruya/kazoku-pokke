import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { NotificationSettingsForm } from "@/components/notification-settings-form";
import { PageHeader } from "@/components/page-header";
import { formatDateTime } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { requireHousehold } from "@/lib/session";

export const metadata: Metadata = { title: "その他" };
export const dynamic = "force-dynamic";

export default async function MorePage() {
  const { householdId, household, user } = await requireHousehold();
  const [childCount, nextMedical] = await Promise.all([
    prisma.child.count({ where: { householdId } }),
    prisma.medicalSchedule.findFirst({
      where: {
        householdId,
        isCompleted: false,
        date: { gte: new Date() },
      },
      orderBy: { date: "asc" },
    }),
  ]);

  return (
    <main>
      <PageHeader
        title="その他"
        description="家庭、病院の予定、子どものプロフィールを管理します。"
      />
      <div className="mx-auto grid max-w-5xl gap-3 px-4 py-5 md:grid-cols-2 md:px-10">
        <Link
          href="/households"
          prefetch
          className="flex min-h-24 items-center gap-4 rounded-2xl border border-[var(--line)] bg-white p-4 md:col-span-2"
        >
          <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-xl font-black text-[var(--primary)]">家</span>
          <div className="min-w-0 flex-1">
            <h2 className="font-extrabold">家庭と家族</h2>
            <p className="mt-1 truncate text-sm text-[var(--muted)]">
              現在：{household.name}・家族の招待
            </p>
          </div>
          <span aria-hidden="true" className="text-[var(--muted)]">›</span>
        </Link>

        <Link
          href="/medical"
          prefetch
          className="flex min-h-24 items-center gap-4 rounded-2xl border border-[var(--line)] bg-white p-4"
        >
          <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-xl">＋</span>
          <div className="min-w-0 flex-1">
            <h2 className="font-extrabold">病院・予防接種</h2>
            <p className="mt-1 truncate text-sm text-[var(--muted)]">
              {nextMedical
                ? `次回：${nextMedical.title} ${formatDateTime(nextMedical.date)}`
                : "次回の予定はありません"}
            </p>
          </div>
          <span aria-hidden="true" className="text-[var(--muted)]">›</span>
        </Link>

        <Link
          href="/children"
          prefetch
          className="flex min-h-24 items-center gap-4 rounded-2xl border border-[var(--line)] bg-white p-4"
        >
          <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-xl font-black text-[var(--primary)]">子</span>
          <div className="min-w-0 flex-1">
            <h2 className="font-extrabold">子どもプロフィール</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {childCount}人・服と靴のサイズを確認
            </p>
          </div>
          <span aria-hidden="true" className="text-[var(--muted)]">›</span>
        </Link>
        <section className="rounded-2xl border border-[var(--line)] bg-white p-4 md:col-span-2">
          <h2 className="font-extrabold">期限前のメール通知</h2>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
            TODO・保育園・病院予定を、期限・予定日の1日前にまとめてメールします。
          </p>
          <NotificationSettingsForm
            initialEnabled={user.emailReminderEnabled}
          />
        </section>

        <section className="rounded-2xl border border-[var(--line)] bg-white p-4 md:col-span-2">
          <h2 className="font-extrabold">ログイン中のアカウント</h2>
          <p className="mt-1 break-all text-sm text-[var(--muted)]">
            {user.email ?? "メールアドレス未設定"}
          </p>
          <form action={logout}>
            <button className="mt-4 min-h-11 rounded-xl bg-[var(--surface)] px-4 text-sm font-extrabold text-red-700">
              ログアウト
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
