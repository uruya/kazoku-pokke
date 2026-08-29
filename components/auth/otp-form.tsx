"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  verifyEmailOtp,
  type AuthActionState,
} from "@/app/actions/auth";

const initialState: AuthActionState = {};

export function OtpForm({
  email,
  next,
}: {
  email: string;
  next: string;
}) {
  const [state, action, pending] = useActionState(
    verifyEmailOtp,
    initialState,
  );

  return (
    <form action={action} className="mt-8 rounded-3xl bg-white p-5 text-[var(--foreground)] shadow-xl">
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="next" value={next} />
      <p className="break-all text-sm font-bold text-[var(--muted)]">{email}</p>
      <label className="mt-4 block font-extrabold" htmlFor="token">
        6桁の確認コード
      </label>
      <input
        id="token"
        name="token"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]{6}"
        minLength={6}
        maxLength={6}
        required
        autoFocus
        placeholder="123456"
        className="mt-2 min-h-14 w-full rounded-xl border border-[var(--line)] px-3 text-center text-2xl font-extrabold tracking-[0.35em]"
      />
      {state.error ? (
        <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">
          {state.error}
        </p>
      ) : null}
      <button
        disabled={pending}
        className="mt-5 min-h-12 w-full rounded-xl bg-[var(--primary)] px-4 font-extrabold text-white disabled:opacity-60"
      >
        {pending ? "確認中…" : "ログインする"}
      </button>
      <Link
        href={`/login?next=${encodeURIComponent(next)}`}
        className="mt-4 flex min-h-11 items-center justify-center text-sm font-bold text-[var(--primary)]"
      >
        メールアドレスを変更・コードを再送
      </Link>
    </form>
  );
}
