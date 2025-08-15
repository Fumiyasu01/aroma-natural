# デプロイメントガイド

## Vercelへのデプロイ手順

### 1. 事前準備
- Vercelアカウントの作成（https://vercel.com）
- GitHubリポジトリの準備
- 環境変数の準備

### 2. GitHubリポジトリの作成とプッシュ

```bash
# リポジトリの初期化（まだの場合）
git init

# ファイルを追加
git add .

# 初回コミット
git commit -m "Initial commit: Aroma Natural PWA"

# GitHubリポジトリを追加
git remote add origin https://github.com/YOUR_USERNAME/aroma-natural.git

# メインブランチにプッシュ
git branch -M main
git push -u origin main
```

### 3. Vercelでのプロジェクト作成

1. Vercelダッシュボードにログイン
2. 「New Project」をクリック
3. GitHubリポジトリをインポート
4. プロジェクト名を設定（例：aroma-natural）

### 4. 環境変数の設定

Vercelダッシュボードで以下の環境変数を設定：

| 変数名 | 説明 | 取得方法 |
|--------|------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | SupabaseプロジェクトURL | Supabaseダッシュボード → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase匿名キー | Supabaseダッシュボード → Settings → API |
| `OPENAI_API_KEY` | OpenAI APIキー | OpenAIダッシュボード → API Keys |

### 5. デプロイ

1. 「Deploy」ボタンをクリック
2. ビルドログを確認
3. デプロイ完了後、提供されたURLでアクセス確認

### 6. カスタムドメインの設定（オプション）

1. Vercelダッシュボード → Settings → Domains
2. カスタムドメインを追加
3. DNSレコードを設定

## その他のデプロイオプション

### Netlifyへのデプロイ

```bash
# Netlify CLIをインストール
npm install -g netlify-cli

# ビルド
npm run build

# デプロイ
netlify deploy --prod --dir=.next
```

### セルフホスティング

```bash
# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm start
```

Docker使用時：

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## デプロイ後の確認事項

### 必須チェックリスト

- [ ] ホームページが正常に表示される
- [ ] ログイン・サインアップが機能する
- [ ] PWAインストールプロンプトが表示される
- [ ] オフライン時にオフラインページが表示される
- [ ] AI相談機能が動作する
- [ ] データの保存・読み込みが正常
- [ ] チーム機能が動作する
- [ ] プッシュ通知の許可が要求される（設定時）

### パフォーマンス確認

- [ ] Lighthouse スコア確認（目標：90以上）
  - Performance
  - Accessibility
  - Best Practices
  - SEO
  - PWA
- [ ] First Contentful Paint (FCP) < 2秒
- [ ] Time to Interactive (TTI) < 5秒

### セキュリティ確認

- [ ] HTTPS接続の確認
- [ ] 環境変数が公開されていない
- [ ] CSPヘッダーの設定確認
- [ ] APIキーがクライアントコードに含まれていない

## トラブルシューティング

### ビルドエラーの場合

1. Node.jsバージョンを確認（18以上）
2. 環境変数が正しく設定されているか確認
3. `npm ci`で依存関係を再インストール

### Supabase接続エラー

1. Supabase URLとANON KEYを確認
2. Row Level Security (RLS)ポリシーを確認
3. Supabaseダッシュボードでデータベース状態を確認

### PWAが機能しない

1. HTTPSで配信されているか確認
2. Service Workerが登録されているか確認（DevTools → Application）
3. manifest.jsonが正しく配信されているか確認

## 監視とメンテナンス

### 推奨監視ツール

- **Vercel Analytics**: トラフィックとパフォーマンス監視
- **Sentry**: エラートラッキング
- **LogRocket**: ユーザーセッション記録

### 定期メンテナンス

- 週次：依存関係のセキュリティ更新確認
- 月次：パフォーマンスメトリクスのレビュー
- 四半期：大規模アップデートの計画

## サポート

問題が発生した場合：
1. [Vercelステータスページ](https://www.vercel-status.com/)を確認
2. [Supabaseステータスページ](https://status.supabase.com/)を確認
3. アプリケーションログを確認
4. GitHubイシューで報告