"use client";

import { useActionState, useState } from "react";
import {
  createInvitation,
  type InvitationActionState,
} from "@/app/actions/invitations";

const initialState: InvitationActionState = {};

export function InviteLinkForm() {
  const [state, action, pending] = useActionState(
    createInvitation,
    initialState,
  );
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    if (!state.inviteUrl) return;
    await navigator.clipboard.writeText(state.inviteUrl);
    setCopied(true);
  }

  return (
    <div>
      <form action={action}>
        <button
          disabled={pending}
          className="min-h-12 w-full rounded-xl bg-[var(--primary)] px-5 font-extrabold text-white disabled:opacity-60 sm:w-auto"
        >
          {pending ? "作成中…" : "家族の招待リンクを作る"}
        </button>
      </form>
      {state.error ? (
        <p role="alert" className="mt-3 text-sm font-bold text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.inviteUrl ? (
        <div className="mt-4 rounded-2xl bg-[var(--primary-soft)] p-4">
          <p className="text-sm font-extrabold">このリンクを家族へ送ってください</p>
          <p className="mt-2 break-all text-sm">{state.inviteUrl}</p>
          <button
            type="button"
            onClick={copyLink}
            className="mt-3 min-h-11 rounded-xl bg-white px-4 text-sm font-extrabold text-[var(--primary)]"
          >
            {copied ? "コピーしました" : "リンクをコピー"}
          </button>
          <p className="mt-2 text-xs text-[var(--muted)]">
            7日間・1回だけ有効です。SNSなど公開の場所には貼らないでください。
          </p>
        </div>
      ) : null}
    </div>
  );
}
