import { addDays, formatDate, formatDateTime, startOfJapanDay } from "./date";

export type ReminderItem = {
  kind: "TODO" | "保育園" | "病院";
  title: string;
  householdName: string;
  date: Date;
  includesTime: boolean;
};

export function reminderWindow(now = new Date()) {
  const start = addDays(startOfJapanDay(now), 1);
  return { start, end: addDays(start, 1) };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function itemDate(item: ReminderItem) {
  return item.includesTime ? formatDateTime(item.date) : formatDate(item.date);
}

export function buildReminderEmail({
  displayName,
  items,
  appUrl,
}: {
  displayName: string | null;
  items: ReminderItem[];
  appUrl: string;
}) {
  if (items.length === 0) {
    throw new Error("通知対象がありません。");
  }

  const targetDate = formatDate(items[0].date);
  const greeting = displayName ? `${displayName}さん` : "こんにちは";
  const safeAppUrl = new URL(appUrl).toString();
  const textItems = items
    .map(
      (item) =>
        `・[${item.kind}] ${item.title}（${item.householdName}・${itemDate(item)}）`,
    )
    .join("\n");
  const htmlItems = items
    .map(
      (item) =>
        `<li style="margin-bottom:12px"><strong>[${escapeHtml(item.kind)}] ${escapeHtml(item.title)}</strong><br><span style="color:#64748b">${escapeHtml(item.householdName)}・${escapeHtml(itemDate(item))}</span></li>`,
    )
    .join("");

  return {
    subject: `【かぞくポッケ】${targetDate}の予定があります`,
    text: `${greeting}\n\n明日が期限・予定日の項目があります。\n\n${textItems}\n\n確認する：${safeAppUrl}\n\n通知設定はアプリの「その他」から変更できます。`,
    html: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.7;color:#1e293b"><p>${escapeHtml(greeting)}</p><p>明日が期限・予定日の項目があります。</p><ul style="padding-left:20px">${htmlItems}</ul><p><a href="${escapeHtml(safeAppUrl)}" style="display:inline-block;padding:12px 18px;border-radius:10px;background:#16836f;color:#fff;text-decoration:none;font-weight:700">かぞくポッケで確認</a></p><p style="font-size:12px;color:#64748b">通知設定はアプリの「その他」から変更できます。</p></div>`,
  };
}
