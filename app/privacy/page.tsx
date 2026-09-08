import type { Metadata } from "next";
import Link from "next/link";
import {
  PublicInfoSection,
  PublicPageShell,
} from "@/components/public-page-shell";

export const metadata: Metadata = { title: "プライバシーポリシー" };

export default function PrivacyPage() {
  return (
    <PublicPageShell
      title="プライバシーポリシー"
      description="かぞくポッケにおける個人情報と利用者データの取り扱いを説明します。制定日：2026年9月6日・最終改定日：2026年9月8日"
    >
      <PublicInfoSection title="1. 運営者">
        <p>
          本サービスは、かぞくポッケ運営者（個人。以下「運営者」）が提供します。運営者の氏名および住所は、本人からの請求に応じて遅滞なく開示します。請求は
          <Link href="/contact" className="font-bold text-[var(--primary)] underline">
            お問い合わせ窓口
          </Link>
          から行えます。
        </p>
      </PublicInfoSection>

      <PublicInfoSection title="2. 取得する情報">
        <ul className="list-disc space-y-2 pl-5">
          <li>アカウント情報：メールアドレス、認証サービス上の利用者ID、表示名</li>
          <li>家庭情報：家庭名、家族の所属・権限、招待の利用状況</li>
          <li>子ども情報：名前またはニックネーム、生年月日、服・靴のサイズ、メモ</li>
          <li>
            生活管理情報：TODO、保育園の予定・提出物・持ち物、病院・予防接種の予定、病院名、買い物、各メモ、完了状況
          </li>
          <li>通知情報：通知設定、Push通知用の端末識別情報、通知対象項目、送信日時および送信結果</li>
          <li>
            技術情報：Cookie、セッション情報、アクセス日時、IPアドレス、ブラウザ情報、エラーログなど、サービス提供事業者が運用・安全確保のために記録する情報
          </li>
        </ul>
      </PublicInfoSection>

      <PublicInfoSection title="3. 利用目的">
        <ul className="list-disc space-y-2 pl-5">
          <li>本人確認、ログイン、アカウントの維持および不正利用防止</li>
          <li>家庭内での予定、TODO、買い物、子ども情報の保存・表示・共有</li>
          <li>利用者が有効にした期限前通知の作成、メールおよびスマホへのPush通知の送信</li>
          <li>問い合わせ、開示等の請求、障害およびセキュリティ事案への対応</li>
          <li>サービスの保守、利用状況の把握、品質および安全性の改善</li>
          <li>規約違反への対応および法令上必要な対応</li>
        </ul>
      </PublicInfoSection>

      <PublicInfoSection title="4. 家庭内での共有">
        <p>
          家庭へ参加した利用者は、その家庭に保存された情報を閲覧し、機能に応じて追加・変更・削除できます。招待リンクを受け取った人は家庭へ参加できるため、招待リンクは信頼できる家族にだけ共有してください。
        </p>
      </PublicInfoSection>

      <PublicInfoSection title="5. 外部委託先と国外での取り扱い">
        <p>サービス提供のため、主に次の事業者へ必要な範囲で取り扱いを委託します。</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Supabase：認証およびデータベース</li>
          <li>Railway：アプリケーションのホスティング、実行およびログ管理</li>
          <li>Resend：利用者が有効にした通知メールの配信</li>\n          <li>Apple、Google、Mozilla等のブラウザ提供事業者：利用者が有効にしたPush通知の配信</li>
        </ul>
        <p>
          これらは国外の事業者であり、契約・設定・障害対応等に伴い、利用者情報が日本国外で保存または取り扱われる場合があります。運営者は、各事業者の公開するセキュリティ情報、契約条件およびデータ保護条件を確認し、取り扱う情報をサービス提供に必要な範囲へ限定します。
        </p>
      </PublicInfoSection>

      <PublicInfoSection title="6. 第三者提供">
        <p>
          運営者は、本人の同意がある場合、法令に基づく場合、人の生命・身体・財産の保護に必要で同意を得ることが困難な場合など、法令で認められる場合を除き、個人データを第三者へ提供しません。前項の委託先は、個人情報保護法上の第三者提供に該当しない委託として取り扱う場合があります。
        </p>
      </PublicInfoSection>

      <PublicInfoSection title="7. Cookie">
        <p>
          ログイン状態および選択中の家庭を維持するためCookieを使用します。必須Cookieを無効にすると、本サービスへログインできない、または正常に利用できない場合があります。広告目的のCookieは使用していません。
        </p>
      </PublicInfoSection>

      <PublicInfoSection title="8. 保存期間と削除">
        <p>
          利用者情報は、サービス提供に必要な期間保存します。期限前通知のメール送信管理記録は約35日経過後に順次削除します。Push通知用の端末識別情報は、利用者がその端末の通知をOFFにしたとき、配信先の無効を検知したとき、またはアカウント削除時に削除します。アカウントやデータの削除を希望する場合はお問い合わせ窓口から請求できます。共有家庭の情報は他の家族も利用するため、請求者との関連付けのみを削除し、家庭データを残す場合があります。法令対応や不正利用防止のため必要な情報は、必要期間に限り保存することがあります。
        </p>
      </PublicInfoSection>

      <PublicInfoSection title="9. 安全管理措置">
        <ul className="list-disc space-y-2 pl-5">
          <li>認証済み利用者と家庭への所属をサーバー側で確認するアクセス制御</li>
          <li>招待リンクの生トークンを保存せず、ハッシュ値のみを保存する措置</li>
          <li>通信の暗号化、秘密情報の環境変数管理、依存関係の更新</li>
          <li>取り扱う個人情報の範囲を必要最小限にする設計</li>
          <li>委託先のセキュリティ・データ保護条件の確認と必要に応じた見直し</li>
        </ul>
      </PublicInfoSection>

      <PublicInfoSection title="10. 開示、訂正、利用停止等">
        <p>
          本人は、利用目的の通知、保有個人データまたは第三者提供記録の開示、訂正・追加・削除、利用停止・消去、第三者提供の停止を請求できます。登録メールアドレスからお問い合わせください。本人確認後、法令に従って対応します。原則として手数料は請求しませんが、多額の実費を要する場合は事前に相談します。
        </p>
      </PublicInfoSection>

      <PublicInfoSection title="11. 子どもの情報">
        <p>
          子どもの情報は、保護者その他の正当な権限を持つ利用者が入力してください。住所、写真、詳細な病歴、検査結果など、サービス利用に不要な機微性の高い情報は入力しないでください。
        </p>
      </PublicInfoSection>

      <PublicInfoSection title="12. 改定とお問い合わせ">
        <p>
          法令やサービス内容の変更に応じて本ポリシーを改定する場合があります。重要な変更は本サービス上で分かりやすく通知します。ご質問や苦情は
          <Link href="/contact" className="font-bold text-[var(--primary)] underline">
            お問い合わせ窓口
          </Link>
          へご連絡ください。
        </p>
      </PublicInfoSection>
    </PublicPageShell>
  );
}
