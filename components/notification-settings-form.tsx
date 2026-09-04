"use client";

import { useActionState, useState } from "react";
import {
  updateNotificationSettings,
  type NotificationSettingsActionState,
} from "@/app/actions/notification-settings";

export function NotificationSettingsForm({
  initialEnabled,
}: {
  initialEnabled: boolean;
}) {
  const initialState: NotificationSettingsActionState = {
    status: "idle",
    enabled: initialEnabled,
  };
  const [state, action, pending] = useActionState(
    updateNotificationSettings,
    initialState,
  );
  const [enabled, setEnabled] = useState(initialEnabled);
  const showResult =
    state.status === "error" ||
    (state.status === "success" && state.enabled === enabled);

  return (
    <form action={action} className="mt-4">
      <input type="hidden" name="enabled" value={enabled ? "on" : "off"} />
      <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl bg-[var(--surface)] px-4">
        <input
          type="checkbox"
          disabled={pending}
          checked={enabled}
          onChange={(event) => setEnabled(event.target.checked)}
          className="h-6 w-6 shrink-0 accent-[var(--primary)]"
        />
        <span className="flex-1 font-bold">前日メール通知を受け取る</span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-extrabold ${
            enabled
              ? "bg-[var(--primary-soft)] text-[var(--primary)]"
              : "bg-slate-200 text-slate-600"
          }`}
        >
          {enabled ? "ON" : "OFF"}
        </span>
      </label>
      <button
        disabled={pending}
        className="mt-3 min-h-12 w-full rounded-xl bg-[var(--primary)] px-4 text-sm font-extrabold text-white disabled:opacity-60 sm:w-auto"
      >
        {pending ? "保存中…" : "通知設定を保存"}
      </button>
      <div aria-live="polite" aria-atomic="true">
        {showResult ? (
          <p
            role={state.status === "error" ? "alert" : "status"}
            className={`mt-3 rounded-xl p-3 text-sm font-bold ${
              state.status === "success"
                ? "bg-emerald-50 text-emerald-800"
                : "bg-red-50 text-red-700"
            }`}
          >
            {state.status === "success" ? "✓ " : ""}
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
