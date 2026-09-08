import type { Metadata } from "next";
import Link from "next/link";
import { InstallButton } from "@/components/install-button";
import { PublicInfoSection, PublicPageShell } from "@/components/public-page-shell";

export const metadata: Metadata = { title: "ホーム画面に追加" };

export default function InstallPage() {
  return (
    <PublicPageShell title="ホーム画面から、すぐに。" description="かぞくポッケをホーム画面に追加すると、アイコンをタップして家族の予定や買い物を開けます。追加は無料です。">
      <InstallButton />
      <PublicInfoSection title="iPhone・iPad">
        <ol className="list-decimal space-y-2 pl-5">
          <li>このページをSafariで開きます。</li>
          <li>共有メニューを開き、「ホーム画面に追加」を選びます。見つからない場合はメニューを下にスクロールしてください。</li>
          <li>「Webアプリとして開く」が表示された場合はオンにして、「追加」をタップします。</li>
        </ol>
      </PublicInfoSection>
      <PublicInfoSection title="Android">
        <ol className="list-decimal space-y-2 pl-5">
          <li>このページをChromeで開きます。</li>
          <li>右上のメニューから「ホーム画面に追加」または「アプリをインストール」を選びます。</li>
          <li>画面の案内に沿って追加します。表示名は端末やブラウザにより異なります。</li>
        </ol>
      </PublicInfoSection>
      <PublicInfoSection title="追加したあと">
        <p>ホーム画面のアイコンから開いてください。ログイン画面が表示された場合は、いつもと同じメールアドレスでログインすると、参加している家庭を利用できます。</p>
        <p>予定の表示・変更にはインターネット接続が必要です。ホーム画面への追加だけではプッシュ通知は届きません。現在は「その他」で期限前のメール通知を設定できます。</p>
        <p>LINEなどのアプリ内で開いていて追加できない場合は、SafariやChromeで開き直してください。パソコンでは対応ブラウザのメニューからインストールできます。</p>
        <Link href="/" className="inline-flex min-h-11 items-center font-bold text-[var(--primary)] underline">かぞくポッケを開く</Link>
      </PublicInfoSection>
    </PublicPageShell>
  );
}
