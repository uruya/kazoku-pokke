import { createHash, randomBytes } from "node:crypto";

const INVITATION_DAYS = 7;

export function hashInvitationToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createInvitationToken() {
  const token = randomBytes(32).toString("base64url");
  return {
    token,
    tokenHash: hashInvitationToken(token),
  };
}

export function invitationExpiresAt(from = new Date()) {
  const expiresAt = new Date(from);
  expiresAt.setDate(expiresAt.getDate() + INVITATION_DAYS);
  return expiresAt;
}

export function isUsableInvitation(invitation: {
  acceptedAt: Date | null;
  expiresAt: Date;
}, now = new Date()) {
  return invitation.acceptedAt === null && invitation.expiresAt > now;
}
