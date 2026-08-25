import Link from "next/link";

type PageHeaderProps = {
  title: string;
  description: string;
  backHref?: string;
};

export function PageHeader({
  title,
  description,
  backHref,
}: PageHeaderProps) {
  return (
    <header className="border-b border-[var(--line)] bg-white px-5 py-6 md:px-10">
      <div className="mx-auto max-w-5xl">
        {backHref ? (
          <Link
            href={backHref}
            className="mb-2 inline-flex min-h-11 items-center text-sm font-bold text-[var(--primary)]"
          >
            ← 戻る
          </Link>
        ) : null}
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
          {description}
        </p>
      </div>
    </header>
  );
}
