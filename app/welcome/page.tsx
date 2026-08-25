import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { startUsingApp } from "@/app/actions/households";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "はじめる" };
export const dynamic = "force-dynamic";

export default async function WelcomePage() {
  if (await getCurrentUser()) redirect("/");
  return (
    <main className="min-h-dvh bg-[var(--primary)] px-5 py-10 text-white">
      <div className="mx-auto max-w-lg">
        <p className="text-sm font-bold text-white/75">すくすくノート</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">わが家のノートを作る</h1>
        <p className="mt-3 leading-7 text-white/85">家庭ごとに専用の場所を作り、育児の予定や買い物を他の家庭と分けて保存します。</p>
        <form action={startUsingApp} className="mt-8 rounded-3xl bg-white p-5 text-[var(--foreground)] shadow-xl">
          <label className="block font-extrabold" htmlFor="householdName">家庭の表示名</label>
          <input id="householdName" name="householdName" required maxLength={60} defaultValue="わが家" className="mt-2 min-h-12 w-full rounded-xl border border-[var(--line)] px-3" />
          <label className="mt-5 block font-extrabold" htmlFor="displayName">あなたの呼び名（任意）</label>
          <input id="displayName" name="displayName" maxLength={60} placeholder="例：ママ、パパ" className="mt-2 min-h-12 w-full rounded-xl border border-[var(--line)] px-3" />
          <button className="mt-6 min-h-12 w-full rounded-xl bg-[var(--primary)] px-4 font-extrabold text-white">この家庭ではじめる</button>
          <p className="mt-4 text-xs leading-5 text-[var(--muted)]">この端末のブラウザに90日間のアクセス情報を保存します。現段階ではメール登録や家族招待は行いません。</p>
        </form>
      </div>
    </main>
  );
}
