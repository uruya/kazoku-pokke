export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="flex min-h-[calc(100dvh-6rem)] items-center justify-center px-4"
    >
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-8 py-6 shadow-[0_5px_18px_rgba(43,58,53,0.08)]">
        <span
          aria-hidden="true"
          className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary-soft)] border-t-[var(--primary)] motion-reduce:animate-none"
        />
        <p className="text-sm font-bold text-[var(--muted)]">
          読み込んでいます
        </p>
      </div>
    </main>
  );
}
