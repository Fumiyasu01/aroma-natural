# アロマナチュラル - Aroma Natural 🌿

アロマセラピーの継続利用をサポートする、モバイルファーストのプログレッシブウェブアプリケーション（PWA）です。

## 🌟 コンセプト

**「使う・記録する・つながる」**

アロマ初心者から愛好家まで、誰もが簡単にアロマライフを楽しめるアプリです。

## ✨ 主な機能

### 🎯 使う（ホーム）
- 気分に基づくアロマ提案
- パーソナライズされたレコメンデーション
- 手持ちアロマを優先した提案

### 📝 記録
- 日々のアロマ使用記録
- カレンダービュー
- 連続記録の追跡
- 月間レポートのダウンロード

### 👥 つながる（チーム）
- チーム作成・参加
- メンバー間での記録共有
- チーム内ランキング
- グループチャレンジ

### 🔍 探す・相談
- 症状からアロマを検索
- AI相談機能（GPT-4）
- アロマ辞典
- ブレンドレシピ集

### 📊 分析
- 使用統計のグラフ表示
- 気分改善トレンドの可視化
- アロマ使用パターン分析

## 🛠 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **データベース**: Supabase (PostgreSQL)
- **認証**: Supabase Auth
- **AI**: OpenAI API (GPT-4)
- **グラフ**: Recharts
- **アニメーション**: Framer Motion
- **PWA**: next-pwa

## 📱 PWA機能

- ✅ オフライン対応
- ✅ ホーム画面追加
- ✅ プッシュ通知
- ✅ バックグラウンド同期

## 🚀 セットアップ

### 必要な環境
- Node.js 18以上
- npm または yarn

### インストール手順

1. リポジトリをクローン
```bash
git clone https://github.com/yourusername/aroma-natural.git
cd aroma-natural
```

2. 依存関係をインストール
```bash
npm install
```

3. 環境変数を設定
```bash
cp .env.example .env.local
```

`.env.local`ファイルを編集し、以下の値を設定：
- `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトのURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseの匿名キー
- `OPENAI_API_KEY`: OpenAI APIキー

4. Supabaseデータベースをセットアップ
   - Supabaseダッシュボードで新しいプロジェクトを作成
   - `/supabase/schema.sql`の内容をSQL Editorで実行

5. 開発サーバーを起動
```bash
npm run dev
```

アプリケーションは`http://localhost:3002`で起動します。

## 📝 使用方法

### 初回セットアップ
1. アカウントを作成
2. プロフィール設定（ニックネーム、経験レベル、手持ちアロマ）
3. 通知の許可（オプション）

### 基本的な使い方
1. **気分選択**: ホーム画面で「今日の気分を選ぶ」をタップ
2. **記録**: 使用したアロマと気分の変化を記録
3. **分析**: プロフィールメニューから使用分析を確認
4. **チーム**: 友達や家族とチームを作成して共有

## 🏗 プロジェクト構造

```
aroma-natural/
├── app/                    # Next.js App Router
│   ├── api/               # APIエンドポイント
│   ├── records/           # 記録ページ
│   ├── teams/             # チームページ
│   ├── search/            # 検索・辞典ページ
│   └── profile/           # プロフィール関連
├── components/            # Reactコンポーネント
├── contexts/              # Contextプロバイダー
├── hooks/                 # カスタムフック
├── lib/                   # ユーティリティ
├── data/                  # 静的データ
├── public/                # 静的アセット
└── supabase/             # データベーススキーマ
```

## 🔐 セキュリティ

- Supabase Row Level Security (RLS)によるデータ保護
- 環境変数による機密情報の管理
- HTTPSによる通信の暗号化

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 📧 お問い合わせ

ご質問やフィードバックがある場合は、[Issues](https://github.com/yourusername/aroma-natural/issues)までお願いします。

---

Made with 💜 by Aroma Natural Team