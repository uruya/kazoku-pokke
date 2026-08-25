"use client";

import { useFormStatus } from "react-dom";

type ServerAction = (formData: FormData) => void | Promise<void>;

export function SubmitButton({ label = "保存する" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-12 w-full rounded-xl bg-[var(--primary)] px-5 font-extrabold text-white disabled:cursor-wait disabled:opacity-60 sm:w-auto"
    >
      {pending ? "保存中…" : label}
    </button>
  );
}

export function ToggleButton({
  action,
  completed,
  label,
}: {
  action: ServerAction;
  completed: boolean;
  label: string;
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        aria-label={label}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-lg font-black ${
          completed
            ? "border-[var(--primary)] bg-[var(--primary)] text-white"
            : "border-[#aab6b1] bg-white text-transparent"
        }`}
      >
        ✓
      </button>
    </form>
  );
}

export function DeleteButton({ action }: { action: ServerAction }) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm("この項目を削除しますか？")) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="min-h-11 rounded-xl px-3 text-sm font-bold text-[#b14f43]"
      >
        削除
      </button>
    </form>
  );
}
