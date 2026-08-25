import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "sukusuku_session";
const HOUSEHOLD_COOKIE = "sukusuku_household";
const SESSION_DAYS = 90;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createSessionToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashToken(token) };
}

export function sessionExpiresAt() {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);
  return expiresAt;
}

export async function setSessionCookies(token: string, householdId: string, expiresAt: Date) {
  const cookieStore = await cookies();
  const options = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  };
  cookieStore.set(SESSION_COOKIE, token, options);
  cookieStore.set(HOUSEHOLD_COOKIE, householdId, options);
}

export async function setActiveHouseholdCookie(householdId: string) {
  (await cookies()).set(HOUSEHOLD_COOKIE, householdId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    path: "/",
  });
}

export async function getCurrentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { include: { memberships: { include: { household: true } } } } },
  });
  if (!session || session.expiresAt <= new Date()) return null;
  return session.user;
}

export async function requireHousehold() {
  const user = await getCurrentUser();
  if (!user || user.memberships.length === 0) redirect("/welcome");
  const requestedId = (await cookies()).get(HOUSEHOLD_COOKIE)?.value;
  const membership = user.memberships.find((item) => item.householdId === requestedId) ?? user.memberships[0];
  return {
    userId: user.id,
    householdId: membership.householdId,
    household: membership.household,
    memberships: user.memberships,
  };
}
