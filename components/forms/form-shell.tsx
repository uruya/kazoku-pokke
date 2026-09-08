import type { ReactNode } from "react";

export const inputClass =
  "mt-1 min-h-12 min-w-0 w-full max-w-full rounded-xl border border-[#cbc9c3] bg-white px-3 text-base text-[var(--foreground)] placeholder:text-[#9ba29f] focus:border-[var(--primary)] focus:outline-none";

export const textareaClass =
  "mt-1 min-h-24 min-w-0 w-full max-w-full resize-y rounded-xl border border-[#cbc9c3] bg-white px-3 py-2 text-base text-[var(--foreground)] placeholder:text-[#9ba29f] focus:border-[var(--primary)] focus:outline-none";

export const labelClass = "block min-w-0 text-sm font-bold text-[var(--foreground)]";

type FormPanelProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function FormPanel({
  title,
  children,
  defaultOpen = false,
}: FormPanelProps) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-[var(--line)] bg-white"
    >
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-4 font-extrabold text-[var(--primary)]">
        <span>{title}</span>
        <span
          aria-hidden="true"
          className="text-2xl font-normal transition-transform group-open:rotate-45"
        >
          ＋
        </span>
      </summary>
      <div className="border-t border-[var(--line)] p-4">{children}</div>
    </details>
  );
}
