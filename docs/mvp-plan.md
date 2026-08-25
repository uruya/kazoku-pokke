# 子育て家庭の生活管理ツール MVP 設計

## 1. 要件整理

### 解決する課題

保育園、病院、買い物、家庭内TODOに分散した情報を一か所に集め、スマートフォンで「今日・今週やること」を数秒で確認・更新できるようにする。

### MVPの範囲

- ダッシュボードで今日のTODO、期限間近のTODO、今週の予定、未購入品、次回の病院予定を確認する
- TODOを作成・編集・削除・完了切り替えする
- 保育園の行事・提出物・持ち物を作成・編集・削除・完了切り替えする
- 子どもの最小限のプロフィールを作成・編集・削除する
- 病院・予防接種予定を作成・編集・削除・完了切り替えする
- 買い物を作成・編集・削除・購入済み切り替えする
- 家庭単位のテナント分離と端末セッションを含める
- メール認証、家族招待、高度な権限、通知、外部連携、写真、課金、AIは含めない

### UX原則

- 375px前後の画面幅を基準に、主要操作は44px以上のタップ領域を確保する
- 一覧は未完了を優先し、状態・期限・カテゴリを短い日本語で示す
- 追加ボタンと完了操作を一覧の近くに置き、入力項目を必要最小限にする
- 日付は日本時間・日本語表記を基本にする
- 個人情報はニックネーム、生年月日、サイズ、自由メモだけを保存し、住所・写真・医療詳細は保持しない

## 2. 画面一覧

| 画面 | パス | 主な内容 |
| --- | --- | --- |
| ホーム | `/` | 今日、期限間近、今週、買い物、次回病院予定 |
| TODO | `/todos` | 一覧、追加、編集、削除、完了切り替え |
| 保育園 | `/nursery` | 行事・提出物・持ち物の一覧とCRUD |
| 病院 | `/medical` | 病院・予防接種予定の一覧とCRUD |
| 買い物 | `/shopping` | 未購入・購入済みの一覧とCRUD |
| 子ども | `/children` | プロフィール一覧とCRUD |
| 初回設定 | `/welcome` | 利用者と最初の家庭を作成 |
| 家庭管理 | `/households` | 所属家庭の一覧、追加、切り替え |

全画面で下部ナビゲーションを共有し、ホームから主要情報へ直接移動できる。

## 3. Prismaデータモデル案

### User / Session / Household / HouseholdMember

- `Household` をテナント境界とし、すべての業務データが必ず `householdId` を持つ
- `User` と `Household` は多対多で、`HouseholdMember` が所属と役割を保持する
- `Session` は生のトークンを保存せずSHA-256ハッシュと期限だけを保持する
- 選択中の家庭IDはHttpOnly Cookieへ保存するが、サーバー側で毎回Membershipを確認する
- 更新と削除は `id + householdId` の複合一意キーを使い、他家庭のIDを渡しても操作できない

### Child

- `id`: 主キー
- `nickname`: 名前またはニックネーム
- `birthDate`: 生年月日
- `clothingSize`: 服サイズ（自由入力）
- `shoeSize`: 靴サイズ（自由入力）
- `note`: 任意メモ
- `createdAt`, `updatedAt`: 監査用日時
- `householdId`: 所属家庭。家庭を削除した場合は関連データも削除する

### Todo

- `id`, `title`, `category`, `dueDate`, `isCompleted`, `note`
- `createdAt`, `updatedAt`
- よく使う未完了・期限順の検索向けに複合インデックスを付ける

### NurseryItem

- `id`, `title`, `type`（行事・提出物・持ち物）, `date`, `isCompleted`, `note`
- `createdAt`, `updatedAt`
- 種別・完了状態・日付の絞り込み向けインデックスを付ける

### MedicalSchedule

- `id`, `title`, `date`, `hospitalName`, `isCompleted`, `note`
- `createdAt`, `updatedAt`
- 未完了・日付順の検索向けインデックスを付ける

### ShoppingItem

- `id`, `name`, `category`, `isPurchased`, `note`
- `createdAt`, `updatedAt`
- 未購入・作成日時順の検索向けインデックスを付ける

カテゴリと種別はTypeScriptのリテラル型とServer Actionの入力検証で制約し、表示名だけをUI側で日本語へ変換する。MVPではデータベースenumを増やさず、カテゴリ追加を小さな変更で行える設計にする。

## 4. ディレクトリ構成

```text
app/
  actions/             # モデル別Server Actions
  children/            # 子ども画面
  medical/             # 病院画面
  nursery/             # 保育園画面
  shopping/            # 買い物画面
  todos/               # TODO画面
  layout.tsx            # 共通レイアウト
  page.tsx              # ダッシュボード
components/
  forms/                # モデル別入力フォーム
  ui/                   # ボタン、カード、ダイアログ等
lib/
  constants.ts          # カテゴリ表示定義
  date.ts               # 日付表示・期間計算
  prisma.ts             # Prisma Client singleton
  session.ts            # セッションと家庭コンテキスト
prisma/
  schema.prisma
tests/                  # ビジネスロジックの単体テスト
```

## 5. 実装順序

1. Next.js、TypeScript、Tailwind CSS、Prisma、PostgreSQLの基盤を作る
2. Prismaスキーマとマイグレーションを作る
3. モバイル共通レイアウト、ナビゲーション、UI部品を作る
4. ダッシュボードの読み取り表示を作る
5. TODO CRUDを作り、型・lint・buildを確認する
6. 保育園 CRUDを作り、型・lint・buildを確認する
7. 病院、買い物、子どもプロフィールのCRUDを順に作る
8. 日付ロジックのテスト、アクセシビリティ、空状態、READMEを整える
9. 型チェック、lint、テスト、production buildを最終確認する

## 6. テナント設計

データ境界はUIの選択状態ではなく、サーバー側で取得する現在の `householdId` です。すべての読み取り条件へ家庭IDを含め、書き込みデータにもサーバー側で家庭IDを付与します。クライアントから家庭IDをフォーム送信させないため、値の改ざんによる別家庭への書き込みを防ぎます。

PostgreSQLの検索インデックスは家庭IDを先頭に置き、家庭内の未完了・期限順検索へ合わせています。

現在はローカルMVP向けの端末セッションです。本番SaaS化では認証プロバイダーの安定IDを `User` に接続し、招待を承認した時だけ `HouseholdMember` を追加します。OWNER/MEMBERの役割は用意していますが、今回の全CRUDは両者に許可し、高度な権限管理は追加していません。
