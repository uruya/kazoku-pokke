"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  requestEmailOtp,
  type AuthActionState,
} from "@/app/actions/auth";

const initialState: AuthActionState = {};

export function EmailLoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(
    requestEmailOtp,
    initialState,
  );

  return (
    <form action={action} className="mt-8 rounded-3xl bg-white p-5 text-[var(--foreground)] shadow-xl">
      <input type="hidden" name="next" value={next} />
      <label className="block font-extrabold" htmlFor="email">
        メールアドレス
      </label>
      <input
        id="email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        maxLength={254}
        placeholder="例：family@example.com"
        className="mt-2 min-h-12 w-full rounded-xl border border-[var(--line)] px-3"
      />
      {state.error ? (
        <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">
          {state.error}
        </p>
      ) : null}
      <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
        パスワードは不要です。入力したメールアドレスへ6桁の確認コードを送ります。
      </p>
      <label className="mt-4 flex items-start gap-3 rounded-xl bg-[var(--surface)] p-3 text-xs leading-5 text-[var(--muted)]">
        <input
          type="checkbox"
          name="acceptTerms"
          required
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--primary)]"
        />
        <span>
          <Link
            href="/terms"
            target="_blank"
            className="font-bold text-[var(--primary)] underline"
          >
            利用規約
          </Link>
          と
          <Link
            href="/privacy"
            target="_blank"
            className="font-bold text-[var(--primary)] underline"
          >
            プライバシーポリシー
          </Link>
          （国外の委託先での情報の取り扱いを含む）を確認し、同意します。
        </span>
      </label>
      <button
        disabled={pending}
        className="mt-5 min-h-12 w-full rounded-xl bg-[var(--primary)] px-4 font-extrabold text-white disabled:opacity-60"
      >
        {pending ? "送信中…" : "確認コードを受け取る"}
      </button>
    </form>
  );
}
