import "server-only";

import { createHash } from "node:crypto";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const LEGACY_SESSION_COOKIE = "sukusuku_session";
const HOUSEHOLD_COOKIE = "sukusuku_household";
const HOUSEHOLD_COOKIE_DAYS = 90;

const userWithMemberships = {
  memberships: {
    include: { household: true },
    orderBy: { createdAt: "asc" as const },
  },
};

function hashLegacyToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function normalizedEmail(email: string | undefined) {
  return email?.trim().toLowerCase() || null;
}

export async function setActiveHouseholdCookie(householdId: string) {
  (await cookies()).set(HOUSEHOLD_COOKIE, householdId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: HOUSEHOLD_COOKIE_DAYS * 24 * 60 * 60,
    path: "/",
  });
}

export async function clearApplicationCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(HOUSEHOLD_COOKIE);
  cookieStore.delete(LEGACY_SESSION_COOKIE);
}

export async function linkAuthenticatedUser(authUser: SupabaseUser) {
  const email = normalizedEmail(authUser.email);
  const cookieStore = await cookies();
  const legacyToken = cookieStore.get(LEGACY_SESSION_COOKIE)?.value;
  const legacySession = legacyToken
    ? await prisma.session.findUnique({
        where: { tokenHash: hashLegacyToken(legacyToken) },
        include: { user: true },
      })
    : null;

  const appUser = await prisma.$transaction(async (tx) => {
    const linked = await tx.user.findUnique({
      where: { authUserId: authUser.id },
    });
    if (linked) {
      return tx.user.update({
        where: { id: linked.id },
        data: { email },
      });
    }

    const emailOwner = email
      ? await tx.user.findUnique({ where: { email } })
      : null;
    const legacyUser =
      legacySession && legacySession.user.authUserId == null
        ? legacySession.user
        : null;
    const candidate =
      legacyUser ?? (emailOwner?.authUserId == null ? emailOwner : null);

    const user = candidate
      ? await tx.user.update({
          where: { id: candidate.id },
          data: { authUserId: authUser.id, email },
        })
      : await tx.user.create({
          data: { authUserId: authUser.id, email },
        });

    await tx.session.deleteMany({ where: { userId: user.id } });
    return user;
  });

  cookieStore.delete(LEGACY_SESSION_COOKIE);
  return appUser;
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  const authUserId = data?.claims?.sub;

  if (error || typeof authUserId !== "string") return null;

  return prisma.user.findUnique({
    where: { authUserId },
    include: userWithMemberships,
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireHousehold() {
  const user = await requireUser();
  if (user.memberships.length === 0) redirect("/welcome");

  const requestedId = (await cookies()).get(HOUSEHOLD_COOKIE)?.value;
  const membership =
    user.memberships.find((item) => item.householdId === requestedId) ??
    user.memberships[0];

  return {
    user,
    userId: user.id,
    householdId: membership.householdId,
    household: membership.household,
    membership,
    memberships: user.memberships,
  };
}
