# 本番運用・障害復旧手順

最終更新: 2026-09-07

## 監視方針

- Railwayのデプロイ時ヘルスチェックは `GET /api/health` を使う。このエンドポイントはアプリプロセスの起動確認だけを行い、外部DB障害による再起動ループを避けるためDBへ接続しない。
- Railwayのヘルスチェックはデプロイ時のみであり、常時監視ではない。外部監視サービスから `https://kazoku-pokke.jp/api/health` を5分間隔で監視し、2回連続失敗で運営者へメール通知する。
- RailwayのObservabilityでデプロイログとエラーログを確認する。デプロイ失敗・クラッシュ通知を有効にする。
- ログへ子どもの名前、メール本文、招待トークンなどの個人情報を追加しない。

## バックアップ方針

子どもの名前・生年月日・予定を扱うため、バックアップを公開リポジトリへ保存しない。

- 目標復旧時点（RPO）: 最大24時間前。最低7日分を保持する。
- 目標復旧時間（RTO）: 障害を確認してから8時間以内。
- 推奨構成: Supabase Proの自動日次バックアップ（7日保持）を利用し、DBマイグレーション前は手動の論理バックアップも取得する。
- Freeプランの場合: 週1回とDBマイグレーション前にSupabase CLIで論理バックアップを取得する。この場合のRPOは最大7日となる。
- 手動バックアップは暗号化した個人用ストレージへ保存し、30日後に削除する。接続文字列やDBパスワードをファイル名・ログ・Gitへ残さない。

### 手動バックアップ

1. Supabase Dashboardの **Connect** からSession poolerの接続文字列を取得する。
2. リポジトリ外に日付付きの空ディレクトリを作る。
3. 端末の環境変数 `SUPABASE_DB_URL` に接続文字列を一時設定する。
4. 次を実行する。

```bash
supabase db dump --db-url "$SUPABASE_DB_URL" -f roles.sql --role-only
supabase db dump --db-url "$SUPABASE_DB_URL" -f schema.sql
supabase db dump --db-url "$SUPABASE_DB_URL" -f data.sql --use-copy --data-only -x "storage.buckets_vectors" -x "storage.vector_indexes"
```

5. 3ファイルが空でないことを確認し、まとめて暗号化して個人用ストレージへ移す。
6. 環境変数を解除し、暗号化前のファイルを削除する。

## 復旧手順

1. 変更作業を止め、障害発生時刻と影響範囲を記録する。
2. アプリだけの障害ならRailwayで直前の正常なデプロイへRollbackする。DBは巻き戻さない。
3. DB破損・誤削除なら復旧対象時刻を決め、Supabaseの **Database → Backups** から直前の正常なバックアップを選ぶ。復元中は停止時間が発生する。
4. 手動復旧はSupabase公式手順に従い、新規プロジェクトでroles、schema、dataの順に検証する。本番DBへ直接試行しない。
5. 復旧後に、新規ログイン、家庭データ表示、招待、TODO作成、リマインド送信を確認する。
6. 原因、失われた可能性がある期間、再発防止策を記録する。

## Push通知の鍵管理\n\n- WebサービスとCronサービスには必ず同じVAPID公開鍵・秘密鍵を設定する。\n- VAPID秘密鍵はGitやログへ残さず、Railwayの環境変数で管理する。\n- VAPID鍵を変更すると既存端末は通知を再設定する必要があるため、漏えい対応以外では不用意にローテーションしない。\n\n## 定期確認

- 毎月、Railwayのクラッシュ履歴、Supabaseのバックアップ、ResendとWeb Pushの送信失敗、各サービスの利用上限を確認する。
- 3か月に1回、最新バックアップを使った別環境への復元テストを行う。
- Railway、Supabase、Resend、Cloudflareの管理者アカウントで多要素認証を使う。
