import type { Metadata } from "next";
import Link from "next/link";
import { AcceptInviteForm } from "@/components/invitations/accept-invite-form";
import { hashInvitationToken, isUsableInvitation } from "@/lib/invitations";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "家庭への招待" };
export const dynamic = "force-dynamic";

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invitation =
    token.length >= 32 && token.length <= 128
      ? await prisma.householdInvitation.findUnique({
          where: { tokenHash: hashInvitationToken(token) },
          include: { household: true },
        })
      : null;
  const usable = invitation ? isUsableInvitation(invitation) : false;
  const user = await getCurrentUser();
  const next = `/invite/${token}`;

  return (
    <main className="min-h-dvh bg-[var(--primary)] px-5 py-10 text-white">
      <div className="mx-auto max-w-lg">
        <p className="text-sm font-bold text-white/75">すくすくノート</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
          家庭への招待
        </h1>
        <div className="mt-8 rounded-3xl bg-white p-5 text-[var(--foreground)] shadow-xl">
          {usable && invitation ? (
            <>
              <p className="text-sm font-bold text-[var(--muted)]">
                招待された家庭
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">
                {invitation.household.name}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                参加すると、この家庭のTODO、保育園、病院、買い物情報を家族と共有できます。
              </p>
              <div className="mt-5">
                {user ? (
                  <AcceptInviteForm token={token} />
                ) : (
                  <Link
                    href={`/login?next=${encodeURIComponent(next)}`}
                    className="flex min-h-12 items-center justify-center rounded-xl bg-[var(--primary)] px-5 font-extrabold text-white"
                  >
                    メールでログインして参加
                  </Link>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-extrabold">
                この招待リンクは利用できません
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                使用済み、期限切れ、またはURLが途中で切れている可能性があります。招待した家族に新しいリンクを作ってもらってください。
              </p>
              <Link
                href={user ? "/" : "/login"}
                className="mt-5 flex min-h-12 items-center justify-center rounded-xl bg-[var(--primary-soft)] px-5 font-extrabold text-[var(--primary)]"
              >
                {user ? "ホームへ戻る" : "ログインへ"}
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
