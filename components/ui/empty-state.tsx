export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#c9cec9] bg-white px-5 py-10 text-center">
      <p className="font-bold text-[var(--muted)]">{message}</p>
    </div>
  );
}
