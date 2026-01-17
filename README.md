# HS-SIMS (高校生情報管理システム)

履歴管理（Temporal Data）機能を備えた、Next.jsベースの生徒情報管理アプリケーションです。

## 技術スタック
- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **データベース**: PostgreSQL
- **ORM**: Prisma
- **UI**: Tailwind CSS + shadcn/ui

## 主な機能
1. **履歴管理 (Temporal Data)**: 住所や氏名などの変更履歴を発効日ベースで追跡。
2. **氏名切り替え機能**: 本名と通称（旧姓や芸名など）をトグルで表示切り替え可能。
3. **年次更新（一括進級）**: スプレッドシート形式のインターフェースで、次年度の在籍情報を一括作成。
4. **高速検索**: クライアントサイドフィルタリングによる即時検索結果表示。

## セットアップ手順

1. **依存関係のインストール**
   ```bash
   npm install
   ```

2. **データベースの設定**
   PostgreSQLデータベースが稼働していることを確認し、`.env` ファイルの接続文字列を更新してください：
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/hs_sims?schema=public"
   ```

3. **データベースの初期化**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **開発サーバーの起動**
   ```bash
   npm run dev
   ```

## 主要コンポーネント
- `src/app/page.tsx`: 生徒ダッシュボード (KPI表示 & 検索)
- `src/app/students/[id]/page.tsx`: 生徒詳細 (プロフィール & タイムライン表示)
- `src/app/promotion/page.tsx`: 一括進級処理用インターフェース
- `src/lib/prisma.ts`: Prismaクライアント・シングルトン

## アーキテクチャの概要
- **データ履歴 (Data History)**: 重要な項目の変更は `DataHistory` テーブルに保存され、UIではこれらの変更を時系列（タイムライン）で表示します。
- **年度更新ロジック**: `/api/promotion` エンドポイントが、現在の在籍情報を次年度へコピー（進級処理）するロジックを担当します。
