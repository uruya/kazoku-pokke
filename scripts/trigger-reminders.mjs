import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const secret = process.env.CRON_SECRET;

if (!appUrl || !secret) {
  throw new Error("NEXT_PUBLIC_APP_URL と CRON_SECRET を設定してください。");
}

const response = await fetch(new URL("/api/cron/reminders", appUrl), {
  method: "POST",
  headers: { Authorization: `Bearer ${secret}` },
});
const body = await response.text();

if (!response.ok) {
  throw new Error(`期限通知の実行に失敗しました（${response.status}）: ${body}`);
}

console.log(body);
