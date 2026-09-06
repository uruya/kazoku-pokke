import type { Metadata } from "next";
import {
  PublicInfoSection,
  PublicPageShell,
} from "@/components/public-page-shell";
import { validContactEmail } from "@/lib/contact";

export const metadata: Metadata = { title: "お問い合わせ" };
export const dynamic = "force-dynamic";

export default function ContactPage() {
  const email = validContactEmail(process.env.CONTACT_EMAIL);
  const subject = encodeURIComponent("かぞくポッケへのお問い合わせ");

  return (
    <PublicPageShell
      title="お問い合わせ"
      description="サービスに関するご質問、個人情報に関する請求、不具合のご連絡を受け付けます。"
    >
      <PublicInfoSection title="連絡方法">
        {email ? (
          <p>
            次のメールアドレスまでご連絡ください。通常、内容を確認してから7日以内を目安に返信します。
          </p>
        ) : (
          <p
            role="status"
            className="rounded-2xl bg-amber-50 p-4 font-bold text-amber-900"
          >
            問い合わせ窓口は現在準備中です。一般公開前に運営者が設定します。
          </p>
        )}
        {email ? (
          <a
            href={"mailto:" + email + "?subject=" + subject}
            className="inline-flex min-h-12 items-center rounded-xl bg-[var(--primary)] px-5 font-extrabold text-white"
          >
            {email}
          </a>
        ) : null}
      </PublicInfoSection>

      <PublicInfoSection title="個人情報に関する請求">
        <p>
          利用目的の通知、保有個人データの開示、訂正、利用停止、削除などを希望する場合は、登録したメールアドレスからご連絡ください。本人確認に必要な範囲で追加情報をお願いする場合があります。
        </p>
      </PublicInfoSection>

      <PublicInfoSection title="お問い合わせ時のお願い">
        <ul className="list-disc space-y-2 pl-5">
          <li>登録メールアドレスとお問い合わせの種類を記載してください。</li>
          <li>
            確認コード、招待リンク、パスワードなどの認証情報は送らないでください。
          </li>
          <li>
            子どもの氏名、病歴など、調査に不要な詳しい個人情報は記載しないでください。
          </li>
          <li>
            緊急の医療相談には対応できません。医療機関や公的な相談窓口へ連絡してください。
          </li>
        </ul>
      </PublicInfoSection>
    </PublicPageShell>
  );
}
