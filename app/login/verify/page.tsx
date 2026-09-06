import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OtpForm } from "@/components/auth/otp-form";
import { safeRedirectPath } from "@/lib/auth-redirect";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "確認コード" };
export const dynamic = "force-dynamic";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; next?: string }>;
}) {
  const { email, next: nextValue } = await searchParams;
  const next = safeRedirectPath(nextValue);

  if (!email) redirect(`/login?next=${encodeURIComponent(next)}`);
  if (await getCurrentUser()) redirect(next);

  return (
    <main className="min-h-dvh bg-[var(--primary)] px-5 py-10 text-white">
      <div className="mx-auto max-w-lg">
        <p className="text-sm font-bold text-white/75">かぞくポッケ</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
          確認コードを入力
        </h1>
        <p className="mt-3 leading-7 text-white/85">
          メールに届いた6桁のコードを入力してください。
        </p>
        <OtpForm email={email} next={next} />
      </div>
    </main>
  );
}
