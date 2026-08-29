"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createInvitationToken,
  hashInvitationToken,
  invitationExpiresAt,
} from "@/lib/invitations";
import {
  getCurrentUser,
  requireHousehold,
  setActiveHouseholdCookie,
} from "@/lib/session";

export type InvitationActionState = {
  error?: string;
  inviteUrl?: string;
};

async function requireOwner() {
  const context = await requireHousehold();
  if (context.membership.role !== "OWNER") {
    throw new Error("家族を招待できるのは家庭の管理者だけです。");
  }
  return context;
}

export async function createInvitation(): Promise<InvitationActionState> {
  const { householdId, userId } = await requireOwner();
  const { token, tokenHash } = createInvitationToken();

  await prisma.householdInvitation.create({
    data: {
      householdId,
      createdByUserId: userId,
      tokenHash,
      expiresAt: invitationExpiresAt(),
    },
  });

  const baseUrl = (
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ).replace(/\/$/, "");

  return { inviteUrl: `${baseUrl}/invite/${token}` };
}

export async function revokeInvitation(invitationId: string) {
  const { householdId } = await requireOwner();
  await prisma.householdInvitation.deleteMany({
    where: {
      id: invitationId,
      householdId,
      acceptedAt: null,
    },
  });
}

export async function acceptInvitation(
  _state: InvitationActionState,
  formData: FormData,
): Promise<InvitationActionState> {
  const tokenValue = formData.get("token");
  if (
    typeof tokenValue !== "string" ||
    tokenValue.length < 32 ||
    tokenValue.length > 128
  ) {
    return { error: "招待リンクが正しくありません。" };
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/invite/${tokenValue}`)}`);
  }
  const tokenHash = hashInvitationToken(tokenValue);
  const now = new Date();

  const result = await prisma.$transaction(async (tx) => {
    const invitation = await tx.householdInvitation.findUnique({
      where: { tokenHash },
      select: { id: true, householdId: true },
    });
    if (!invitation) return null;

    const claimed = await tx.householdInvitation.updateMany({
      where: {
        id: invitation.id,
        acceptedAt: null,
        expiresAt: { gt: now },
      },
      data: {
        acceptedAt: now,
        acceptedByUserId: user.id,
      },
    });
    if (claimed.count !== 1) return null;

    await tx.householdMember.upsert({
      where: {
        householdId_userId: {
          householdId: invitation.householdId,
          userId: user.id,
        },
      },
      create: {
        householdId: invitation.householdId,
        userId: user.id,
        role: "MEMBER",
      },
      update: {},
    });

    return invitation.householdId;
  });

  if (!result) {
    return { error: "この招待リンクは使用済みか、期限が切れています。" };
  }

  await setActiveHouseholdCookie(result);
  redirect("/");
}
