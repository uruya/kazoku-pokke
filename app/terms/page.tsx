import type { Metadata } from "next";
import Link from "next/link";
import {
  PublicInfoSection,
  PublicPageShell,
} from "@/components/public-page-shell";

export const metadata: Metadata = { title: "利用規約" };

export default function TermsPage() {
  return (
    <PublicPageShell
      title="利用規約"
      description="かぞくポッケをご利用いただく際の条件を定めます。制定日・最終改定日：2026年9月6日"
    >
      <PublicInfoSection title="1. 適用と同意">
        <p>
          本規約は、かぞくポッケ運営者（以下「運営者」）が提供する本サービスの利用条件を定めます。利用者は、本規約および
          <Link href="/privacy" className="font-bold text-[var(--primary)] underline">
            プライバシーポリシー
          </Link>
          に同意したうえで本サービスを利用します。
        </p>
      </PublicInfoSection>

      <PublicInfoSection title="2. サービスの内容">
        <p>
          本サービスは、育児に関するTODO、保育園・病院の予定、買い物、子どものサイズ等を家庭内で共有するための生活管理ツールです。医療行為、診断、治療、予防接種判断その他の専門的助言を提供するものではありません。
        </p>
      </PublicInfoSection>

      <PublicInfoSection title="3. 利用登録とアカウント管理">
        <ul className="list-disc space-y-2 pl-5">
          <li>利用者は、自身が管理する正しいメールアドレスを使用してください。</li>
          <li>確認コード、ログイン済み端末および招待リンクを適切に管理してください。</li>
          <li>未成年者が利用する場合は、保護者など法定代理人の同意を得てください。</li>
          <li>不正利用に気付いた場合は、速やかにお問い合わせ窓口へ連絡してください。</li>
        </ul>
      </PublicInfoSection>

      <PublicInfoSection title="4. 家庭共有と入力データ">
        <p>
          家庭へ参加した利用者は、その家庭に保存された情報を共同で利用できます。利用者は、共有する相手を確認し、他人の情報を入力する正当な権限を持つこと、入力内容が第三者の権利を侵害しないことについて責任を負います。緊急時に必要な情報の唯一の保管場所として本サービスを使用しないでください。
        </p>
      </PublicInfoSection>

      <PublicInfoSection title="5. 禁止事項">
        <ul className="list-disc space-y-2 pl-5">
          <li>法令、公序良俗または第三者の権利に違反する行為</li>
          <li>不正アクセス、過度な負荷、脆弱性の悪用またはサービス運営の妨害</li>
          <li>他人へのなりすまし、認証情報や招待リンクの不正取得・利用</li>
          <li>有害なプログラム、虚偽情報または権利侵害情報の送信</li>
          <li>本サービスを第三者へ再販売するなど、本来の目的を逸脱した利用</li>
        </ul>
      </PublicInfoSection>

      <PublicInfoSection title="6. 料金">
        <p>
          現在、本サービスは無料で提供します。将来、有料機能を追加する場合は、料金と条件を事前に明示し、利用者の同意なく料金を請求しません。
        </p>
      </PublicInfoSection>

      <PublicInfoSection title="7. サービスの変更・停止">
        <p>
          運営者は、保守、障害対応、セキュリティ確保、外部サービスの停止その他合理的な理由により、本サービスの全部または一部を変更・停止できるものとします。利用者への影響が大きい場合は、緊急時を除き可能な範囲で事前に通知します。
        </p>
      </PublicInfoSection>

      <PublicInfoSection title="8. 利用停止と退会">
        <p>
          利用者が本規約に重大に違反した場合、運営者は利用を制限または停止できます。利用者は
          <Link href="/contact" className="font-bold text-[var(--primary)] underline">
            お問い合わせ窓口
          </Link>
          から退会およびアカウント削除を請求できます。家庭で共有されるデータの取り扱いはプライバシーポリシーに従います。
        </p>
      </PublicInfoSection>

      <PublicInfoSection title="9. 知的財産権">
        <p>
          本サービスのプログラム、デザイン、文章等に関する権利は運営者または正当な権利者に帰属します。利用者が入力したデータの権利は利用者または正当な権利者に留保され、運営者はサービス提供・保守に必要な範囲でのみ取り扱います。
        </p>
      </PublicInfoSection>

      <PublicInfoSection title="10. 保証と責任の範囲">
        <p>
          運営者は、安全で安定した提供に努めますが、本サービスが常に利用可能であること、入力データが完全に保存されること、特定目的に適合することを保証しません。運営者の責任は、運営者の故意または重過失による場合、および消費者契約法その他の法令により制限が認められない場合を除き、法令で認められる範囲に限られます。
        </p>
      </PublicInfoSection>

      <PublicInfoSection title="11. 規約の変更">
        <p>
          運営者は、法令の変更、サービス内容の変更その他必要がある場合に本規約を変更できます。利用者の権利に重大な影響を与える変更は、施行時期と内容をあらかじめ本サービス上で通知します。
        </p>
      </PublicInfoSection>

      <PublicInfoSection title="12. 準拠法・管轄・お問い合わせ">
        <p>
          本規約は日本法に準拠します。本サービスに関する紛争は、民事訴訟法その他の法令に従い、日本国内の管轄裁判所で解決します。本規約に関する連絡は
          <Link href="/contact" className="font-bold text-[var(--primary)] underline">
            お問い合わせ窓口
          </Link>
          へお願いします。
        </p>
      </PublicInfoSection>
    </PublicPageShell>
  );
}
