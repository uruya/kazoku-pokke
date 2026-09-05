"use client";

import Link from "next/link";

type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  return (
    <main
      role="alert"
      className="flex min-h-[calc(100dvh-6rem)] items-center justify-center px-4 py-10"
    >
      <section className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-white p-6 text-center shadow-[0_5px_18px_rgba(43,58,53,0.08)]">
        <span
          aria-hidden="true"
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--warning-soft)] text-2xl"
        >
          !
        </span>
        <h1 className="mt-4 text-xl font-extrabold">
          画面を読み込めませんでした
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          一時的な問題の可能性があります。もう一度試すか、別の画面へ移動してください。
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={retry}
            className="min-h-12 rounded-xl bg-[var(--primary)] px-4 font-extrabold text-white"
          >
            もう一度試す
          </button>
          <Link
            href="/todos"
            prefetch
            className="flex min-h-12 items-center justify-center rounded-xl bg-[var(--primary-soft)] px-4 font-extrabold text-[var(--primary)]"
          >
            TODOを開く
          </Link>
        </div>
        {error.digest ? (
          <p className="mt-5 break-all text-xs text-[var(--muted)]">
            エラー番号：{error.digest}
          </p>
        ) : null}
      </section>
    </main>
  );
}
