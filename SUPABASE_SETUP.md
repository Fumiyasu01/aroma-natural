# Supabase認証設定ガイド

## 重要：Supabaseダッシュボードでの設定

### 1. Authentication設定を開く
1. [Supabaseダッシュボード](https://supabase.com/dashboard)にログイン
2. あなたのプロジェクト（syiowzvefgnmxlxgevco）を選択
3. 左サイドバーの「Authentication」をクリック

### 2. URLの設定（重要！）

#### Authentication → URL Configuration
以下のURLを設定してください：

**Site URL**:
```
https://aroma-natural2.vercel.app
```

**Redirect URLs**（許可するリダイレクトURL）:
```
https://aroma-natural2.vercel.app
https://aroma-natural2.vercel.app/*
http://localhost:3002
http://localhost:3002/*
https://*.vercel.app
```

### 3. メール認証の設定

#### Authentication → Email Templates
1. 「Confirm signup」テンプレートを確認
2. リンクが以下の形式になっているか確認：
```
{{ .ConfirmationURL }}
```

#### Authentication → Settings
1. 「Email Auth」セクションで以下を確認：
   - ✅ Enable Email Signup
   - ✅ Enable Email Confirmations
   - ✅ Double confirm email changes

### 4. Googleログインの設定

#### Authentication → Providers → Google

1. **Google OAuth を有効化**:
   - 「Google」プロバイダーを有効にする

2. **Google Cloud Consoleで設定**:
   1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
   2. 新しいプロジェクトを作成または既存のプロジェクトを選択
   3. 「APIとサービス」→「認証情報」
   4. 「認証情報を作成」→「OAuth クライアント ID」
   5. アプリケーションの種類: 「ウェブアプリケーション」
   6. 名前: 「Aroma Natural」
   7. 承認済みのJavaScript生成元:
      ```
      https://aroma-natural2.vercel.app
      http://localhost:3002
      ```
   8. 承認済みのリダイレクトURI:
      ```
      https://syiowzvefgnmxlxgevco.supabase.co/auth/v1/callback
      ```

3. **SupabaseにGoogle認証情報を設定**:
   - Google Cloud ConsoleからクライアントIDとシークレットをコピー
   - Supabaseダッシュボードに貼り付け
   - 「Save」をクリック

### 5. 確認事項チェックリスト

- [ ] Site URLが`https://aroma-natural2.vercel.app`に設定されている
- [ ] Redirect URLsに本番URLとlocalhostが追加されている
- [ ] Email認証が有効になっている
- [ ] Google認証が有効になっている（必要な場合）
- [ ] Database → Tablesで`users`と`user_profiles`テーブルが存在する

### 6. トラブルシューティング

#### メール認証が届かない場合
1. スパムフォルダを確認
2. Supabaseの「Auth」→「Logs」でエラーを確認
3. メールテンプレートが正しく設定されているか確認

#### Googleログインできない場合
1. Google Cloud ConsoleでOAuth同意画面が設定されているか確認
2. リダイレクトURIが正確に設定されているか確認
3. Supabaseダッシュボードでプロバイダーが有効になっているか確認

#### ログイン後にリダイレクトされない場合
1. Site URLが正しく設定されているか確認
2. Redirect URLsに必要なURLがすべて追加されているか確認

### 7. テスト手順

1. **メール認証テスト**:
   ```
   1. 新規登録でメールアドレスを入力
   2. 確認メールが届く
   3. メール内のリンクをクリック
   4. アプリにリダイレクトされる
   5. ログインできる
   ```

2. **Googleログインテスト**:
   ```
   1. 「Googleでログイン」をクリック
   2. Googleアカウントを選択
   3. アプリにリダイレクトされる
   4. 自動的にログインされる
   ```

---

## 重要な注意事項

⚠️ **本番環境での変更は慎重に行ってください**
- 設定変更後、反映まで数分かかる場合があります
- 既存ユーザーに影響する可能性があります

## サポート

問題が解決しない場合：
1. Supabaseの[ステータスページ](https://status.supabase.com/)を確認
2. [Supabaseドキュメント](https://supabase.com/docs/guides/auth)を参照
3. コンソールログでエラーメッセージを確認