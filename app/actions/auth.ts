"use server";

import { redirect } from "next/navigation";
import { safeRedirectPath } from "@/lib/auth-redirect";
import {
  clearApplicationCookies,
  linkAuthenticatedUser,
} from "@/lib/session";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error?: string;
};

function emailFrom(formData: FormData) {
  const value = formData.get("email");
  if (
    typeof value !== "string" ||
    value.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  ) {
    return null;
  }
  return value.trim().toLowerCase();
}

export async function requestEmailOtp(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (formData.get("acceptTerms") !== "on") {
    return {
      error: "利用規約とプライバシーポリシーへの同意が必要です。",
    };
  }
  const email = emailFrom(formData);
  if (!email) {
    return { error: "正しいメールアドレスを入力してください。" };
  }
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Supabaseの接続設定がありません。READMEの手順に沿って.envを設定してください。",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });

  if (error) {
    return {
      error:
        "確認コードを送信できませんでした。少し待ってからもう一度お試しください。",
    };
  }

  const next = safeRedirectPath(formData.get("next"));
  redirect(
    `/login/verify?email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`,
  );
}

export async function verifyEmailOtp(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = emailFrom(formData);
  const tokenValue = formData.get("token");
  const token =
    typeof tokenValue === "string" ? tokenValue.replace(/\D/g, "") : "";

  if (!email || !/^\d{6}$/.test(token)) {
    return { error: "メールに届いた6桁の確認コードを入力してください。" };
  }
  if (!isSupabaseConfigured()) {
    return { error: "Supabaseの接続設定がありません。" };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error || !data.user) {
    return {
      error:
        "確認コードが正しくないか、期限が切れています。コードを再送してください。",
    };
  }

  await linkAuthenticatedUser(data.user);
  redirect(safeRedirectPath(formData.get("next")));
}

export async function logout() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut({ scope: "local" });
  }
  await clearApplicationCookies();
  redirect("/login");
}
