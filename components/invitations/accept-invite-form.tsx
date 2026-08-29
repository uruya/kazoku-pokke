"use client";

import { useActionState } from "react";
import {
  acceptInvitation,
  type InvitationActionState,
} from "@/app/actions/invitations";

const initialState: InvitationActionState = {};

export function AcceptInviteForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(
    acceptInvitation,
    initialState,
  );

  return (
    <form action={action}>
      <input type="hidden" name="token" value={token} />
      {state.error ? (
        <p role="alert" className="mb-3 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">
          {state.error}
        </p>
      ) : null}
      <button
        disabled={pending}
        className="min-h-12 w-full rounded-xl bg-[var(--primary)] px-5 font-extrabold text-white disabled:opacity-60"
      >
        {pending ? "参加中…" : "この家庭に参加する"}
      </button>
    </form>
  );
}
