import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ページが見つかりません",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#fcfaf5] px-5 py-10">
      <section className="w-full max-w-lg rounded-[2rem] border border-[var(--line)] bg-white p-7 text-center shadow-[0_18px_50px_rgba(43,58,53,0.08)] sm:p-10">
        <span
          aria-hidden="true"
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.35rem] bg-[var(--primary)] text-2xl font-black text-white"
        >
          家
        </span>
        <p className="mt-6 text-sm font-extrabold tracking-[0.16em] text-[var(--primary)]">
          404 NOT FOUND
        </p>
        <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
          ページが見つかりません
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
          URLが変わったか、ページが削除された可能性があります。
          かぞくポッケの紹介ページから、もう一度お探しください。
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link
            href="/about"
            className="flex min-h-12 items-center justify-center rounded-xl bg-[var(--primary)] px-5 font-extrabold text-white"
          >
            紹介ページへ
          </Link>
          <Link
            href="/login"
            className="flex min-h-12 items-center justify-center rounded-xl bg-[var(--primary-soft)] px-5 font-extrabold text-[var(--primary)]"
          >
            ログインへ
          </Link>
        </div>
      </section>
    </main>
  );
}
