import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EmailLoginForm } from "@/components/auth/email-login-form";
import { safeRedirectPath } from "@/lib/auth-redirect";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "ログイン" };
export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next: nextValue } = await searchParams;
  const next = safeRedirectPath(nextValue);
  const user = await getCurrentUser();

  if (user) {
    redirect(
      next !== "/" ? next : user.memberships.length > 0 ? "/" : "/welcome",
    );
  }

  return (
    <main className="min-h-dvh bg-[var(--primary)] px-5 py-10 text-white">
      <div className="mx-auto max-w-lg">
        <p className="text-sm font-bold text-white/75">かぞくポッケ</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
          メールでログイン
        </h1>
        <p className="mt-3 leading-7 text-white/85">
          iPhoneでもAndroidでも、同じメールアドレスでいつでも戻れます。
        </p>
        <EmailLoginForm next={next} />
      </div>
    </main>
  );
}
