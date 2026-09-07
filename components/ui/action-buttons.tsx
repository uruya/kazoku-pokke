"use client";

import { useId, useRef, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/components/ui/toast";

type ServerAction = (formData: FormData) => void | Promise<void>;
type ConfirmAction = () => void | Promise<void | { success: boolean; message?: string }>;

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

export function ConfirmActionButton({
  action,
  buttonLabel,
  title,
  description,
  confirmLabel,
  pendingLabel = "処理中…",
  successMessage,
}: {
  action: ConfirmAction;
  buttonLabel: string;
  title: string;
  description: string;
  confirmLabel: string;
  pendingLabel?: string;
  successMessage: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();

  function closeDialog() {
    dialogRef.current?.close();
  }

  function runAction() {
    startTransition(async () => {
      try {
        const result = await action();
        closeDialog();
        if (result && !result.success) {
          showToast(result.message ?? "処理できませんでした。", "error");
          return;
        }
        showToast(result?.message ?? successMessage, "success");
      } catch {
        closeDialog();
        showToast("処理できませんでした。時間をおいてもう一度お試しください。", "error");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="min-h-11 rounded-xl px-3 text-sm font-bold text-[#b14f43]"
      >
        {buttonLabel}
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onCancel={(event) => {
          if (pending) event.preventDefault();
        }}
        className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-sm rounded-3xl border-0 bg-white p-0 text-[var(--foreground)] shadow-2xl backdrop:bg-slate-950/45 backdrop:backdrop-blur-[2px]"
      >
        <div className="p-5 sm:p-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-xl font-black text-red-700">
            <span aria-hidden="true">!</span>
          </div>
          <h2 id={titleId} className="text-lg font-extrabold">
            {title}
          </h2>
          <p id={descriptionId} className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {description}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={pending}
              onClick={closeDialog}
              className="min-h-12 rounded-xl bg-[var(--surface)] px-4 text-sm font-extrabold disabled:opacity-60"
            >
              キャンセル
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={runAction}
              className="min-h-12 rounded-xl bg-[#b14f43] px-4 text-sm font-extrabold text-white disabled:cursor-wait disabled:opacity-60"
            >
              {pending ? pendingLabel : confirmLabel}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

export function DeleteButton({ action }: { action: ConfirmAction }) {
  return (
    <ConfirmActionButton
      action={action}
      buttonLabel="削除"
      title="この項目を削除しますか？"
      description="削除した項目は元に戻せません。"
      confirmLabel="削除する"
      pendingLabel="削除中…"
      successMessage="削除しました。"
    />
  );
}
