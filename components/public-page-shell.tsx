import Link from "next/link";

export function PublicPageShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-dvh bg-[#fcfaf5] px-5 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between gap-4">
          <Link href="/about" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary)] text-lg font-black text-white shadow-sm">
              家
            </span>
            <span className="font-extrabold tracking-tight">かぞくポッケ</span>
          </Link>
          <Link
            href="/login"
            className="flex min-h-11 items-center rounded-full border border-[var(--line)] bg-white px-4 text-sm font-extrabold text-[var(--primary)]"
          >
            ログイン
          </Link>
        </header>

        <article className="mt-8 rounded-[2rem] border border-[var(--line)] bg-white px-5 py-8 shadow-[0_18px_50px_rgba(43,58,53,0.06)] sm:px-10 sm:py-12">
          <p className="text-xs font-extrabold tracking-[0.16em] text-[var(--primary)]">
            PUBLIC INFORMATION
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 leading-7 text-[var(--muted)]">{description}</p>
          <div className="mt-10 space-y-10 leading-7">{children}</div>
        </article>

        <footer className="flex flex-wrap gap-x-5 gap-y-3 px-2 py-8 text-xs font-bold text-[var(--muted)]">
          <Link href="/terms" className="hover:text-[var(--primary)]">
            利用規約
          </Link>
          <Link href="/privacy" className="hover:text-[var(--primary)]">
            プライバシーポリシー
          </Link>
          <Link href="/contact" className="hover:text-[var(--primary)]">
            お問い合わせ
          </Link>
          <Link href="/about" className="hover:text-[var(--primary)]">
            サービス紹介
          </Link>
        </footer>
      </div>
    </main>
  );
}

export function PublicInfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-extrabold tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3 text-sm text-[var(--muted)] sm:text-base">
        {children}
      </div>
    </section>
  );
}
