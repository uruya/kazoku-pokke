# すくすくノート

0〜3歳くらいの子どもがいる家庭向けに、保育園、育児TODO、病院・予防接種、買い物、子どものサイズ情報を一か所で管理するWebアプリのMVPです。

スマートフォンで「今日と今週に何をするか」を短時間で確認でき、追加・完了操作も同じ画面で行えます。

## セットアップ

### 必要な環境

- Node.js 20.19以上
- npm 10以上を推奨
- Docker Desktop または Docker Engine（ローカルPostgreSQL用）

### 起動方法

~~~bash
npm install
npm run db:up
npm run dev
~~~

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

初回の npm install で .env.example から .env を自動作成します。npm run db:up でローカル開発用のPostgreSQLを起動し、npm run dev の前処理でマイグレーションを自動適用します。画面で家庭名を登録するまで育児データは作成されず、ダミーデータも投入されません。

### Supabase PostgreSQLの接続

Supabase本番環境では、アプリ実行用の `DATABASE_URL` にTransaction pooler（ポート6543、`pgbouncer=true&connection_limit=1`）、マイグレーション用の `DIRECT_URL` にSession pooler（ポート5432）を設定します。これによりWebアクセスでSession接続上限を消費し続けることを防ぎます。

### Supabase Authの設定

1. Supabaseでプロジェクトを作成し、Project URLとPublishable Keyを確認します。
2. `.env` の `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` に値を設定します。
3. Supabase Dashboardの Authentication → Email Templates → Magic Link を開き、本文に `{{ .Token }}` を含めて6桁OTPが届くようにします。
4. Authentication → URL ConfigurationのSite URLを `NEXT_PUBLIC_APP_URL` と同じURLに設定します。

Supabase標準のメール送信は開発確認用です。家族などプロジェクトメンバー以外へ本番メールを送る前に、Authentication → SMTP Settingsで独自SMTPを設定してください。

### 期限前メール通知の設定

1. ResendでAPIキーを作成し、`RESEND_API_KEY` に設定します。
2. Resendで認証済みの送信元を `REMINDER_EMAIL_FROM` に設定します。
3. 推測されにくいランダム文字列を `CRON_SECRET` に設定します。WebサービスとCronサービスで同じ値を使います。
4. Railwayで同じリポジトリからCron用サービスを追加し、Start Commandを `npm run reminders:trigger`、Cron Scheduleを `0 23 * * *` にします。Railway CronはUTC基準のため、日本時間の毎朝8時に実行されます。

Cron用サービスにも `NEXT_PUBLIC_APP_URL` と `CRON_SECRET` を設定してください。通知対象は「その他」で前日メール通知を有効にした利用者だけです。

ローカルで `npm run reminders:trigger` を実行する場合は、プロジェクト直下の `.env` が自動で読み込まれます。独自ドメインをResendで認証するまでは、テスト用として `すくすくノート <onboarding@resend.dev>` を利用できますが、送信先はResendアカウント所有者のメールアドレスに限られます。家族など他の利用者へ送信する前に、認証済みドメインのメールアドレスへ変更してください。

## 使用技術

- Next.js 16 App Router
- React 19
- TypeScript（strict）
- Tailwind CSS 4
- Next.js Server Actions
- Prisma 6
- Resend Email API
- PostgreSQL 16
- Supabase Auth（メールOTP・SSR Cookieセッション）
- Vitest
- ESLint

データベースはローカル開発・本番ともPostgreSQLを前提とし、Prisma経由でアクセスします。

## MVPで実装した機能

### ダッシュボード

- 今日やるTODO
- 7日以内で期限が近いTODO
- 今週の保育園・病院予定
- 未購入の買い物
- 次回の病院・予防接種予定

### ログインと家庭共有

- メールへ届く6桁OTPによるパスワードレスログイン
- 同じメールアドレスで別端末から再ログイン・アカウント復帰
- 7日間・1回限りの家庭招待リンク
- OWNERだけが招待リンクを発行・無効化
- 招待承認後に同じ家庭の情報を共有
- ログアウト
- 旧端末セッションから最初の認証アカウントへ既存データを引き継ぎ

### 期限前メール通知

- TODO・保育園・病院予定の期限・予定日1日前を日本時間で抽出
- 利用者ごとに1日1通へまとめてResendから送信
- 通知のON/OFF、同日重複送信防止、失敗時の再試行
- 秘密トークンで保護した定期実行用Route Handler

### TODO管理

- タイトル、カテゴリ、期限、完了状態、メモ
- 作成、編集、削除、完了切り替え
- 保育園、病院、買い物、家事、その他のカテゴリ

### 保育園管理

- 行事、提出物、持ち物
- タイトル、日付・期限、メモ、完了状態
- 作成、編集、削除、完了切り替え

### 病院・予防接種管理

- 予定名、日時、病院名、メモ、完了状態
- 作成、編集、削除、完了切り替え

### 買い物リスト

- 商品名、カテゴリ、購入済み状態、メモ
- 作成、編集、削除、購入済み切り替え
- おむつ、食品、衣類、保育園用品、日用品、その他のカテゴリ

### 子どもプロフィール

- 名前またはニックネーム、生年月日、服サイズ、靴サイズ、メモ
- 作成、編集、削除
- 住所、写真、詳細な医療情報を保持しない案内

### 家庭ごとのデータ管理

- `Household` をテナント境界として、すべての育児データを家庭IDで分離
- 初回に家庭を作成し、「その他」から複数の家庭を追加・切り替え
- 利用者と家庭を `HouseholdMember` で関連付け、所属していない家庭は選択不可
- 一覧・集計・作成・編集・完了切り替え・削除のすべてでサーバー側の家庭境界を検証
- 新規DBには家庭や育児データを自動投入せず、初回設定で利用者が家庭を作成

## 画面

| 画面 | URL |
| --- | --- |
| 紹介ページ | /about |
| ログイン | /login |
| OTP確認 | /login/verify |
| 家庭への招待 | /invite/[token] |
| ダッシュボード | / |
| TODO | /todos |
| 保育園 | /nursery |
| 買い物 | /shopping |
| 病院・予防接種 | /medical |
| 子どもプロフィール | /children |
| その他メニュー | /more |
| 初回設定 | /welcome |
| 家庭の切り替え | /households |

## 開発用コマンド

~~~bash
npm run typecheck
npm run lint
npm test
npm run build
~~~

スキーマを変更した場合は次のコマンドで開発用マイグレーションを作成します。

~~~bash
npm run db:migrate
~~~

## データとプライバシー

開発データはDocker Composeで起動するPostgreSQLの `postgres_data` ボリュームに保存されます。`.env` はGit管理から除外されています。認証はSupabase Authの署名済みトークンを検証し、SSR Cookieとして更新します。

アプリDBには認証プロバイダーのユーザーIDとログインに必要なメールアドレスだけを保持します。招待リンクの生トークンはDBへ保存せずSHA-256ハッシュだけを保持し、7日後または1回の承認で無効になります。すべての育児データ操作でサーバー側の家庭所属を確認します。

## 今後追加すると良さそうな機能

- Google・Appleなどの外部認証
- 通知時刻・何日前かの個別設定
- 外部カレンダーへの書き出し
- 保育園ごとの繰り返し持ち物テンプレート
- 予防接種スケジュールの任意生成
- PostgreSQLの定期バックアップと復旧手順
- 監査ログ、入力エラーのインライン表示

SNS、チャット、AI、LINE連携、写真、課金などはMVPの範囲外です。

設計の詳細は [docs/mvp-plan.md](docs/mvp-plan.md) を参照してください。
