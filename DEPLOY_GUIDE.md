# デプロイ手順ガイド

## 通常のデプロイ手順

VercelはGitHubリポジトリと連携しているため、コードをGitHubにプッシュするだけで自動的にデプロイされます。

### 1. 変更をコミット
```bash
cd /Users/msys/pokemon-party-weakness-checker
git add .
git commit -m "更新内容の説明"
```

### 2. GitHubにプッシュ
```bash
git push origin main
```

### 3. Vercelが自動デプロイ
- GitHubにプッシュすると、Vercelが自動的に変更を検知
- ビルドが開始され、完了すると自動的にデプロイされます
- 通常1-3分程度で完了します

## デプロイ前の確認（推奨）

### ローカルでビルドテスト
```bash
npm run build
```

ビルドが成功することを確認してからプッシュすることを推奨します。

## cliboに登録するコマンド

cliboは、よく使うコマンドを短縮して登録できるツールです。以下のコマンドを登録すると便利です：

### 基本的なデプロイコマンド
```bash
# デプロイ（コミット + プッシュ）
clibo add deploy "git add . && git commit -m 'Update' && git push origin main"
```

### より詳細なバージョン
```bash
# デプロイ（メッセージを対話的に入力）
clibo add deploy "git add . && git commit -m \"\$1\" && git push origin main"
```

使用例：
```bash
deploy "タイプ選択のUI改善"
```

### その他の便利なコマンド

```bash
# ビルドテスト
clibo add build "npm run build"

# 開発サーバー起動
clibo add dev "npm run dev"

# クリーンビルド
clibo add clean-build "npm run clean && npm run build"

# デプロイ前の確認（ビルド + プッシュ）
clibo add pre-deploy "npm run build && git add . && git commit -m \"\$1\" && git push origin main"
```

## 手動デプロイ（Vercel CLI使用）

Vercel CLIをインストールしている場合：

```bash
# Vercel CLIのインストール（初回のみ）
npm i -g vercel

# デプロイ
vercel

# プロダクションデプロイ
vercel --prod
```

## デプロイ状況の確認

### Vercelダッシュボード
1. https://vercel.com にアクセス
2. プロジェクトを選択
3. 「Deployments」タブでデプロイ履歴を確認

### コマンドライン（Vercel CLI使用時）
```bash
vercel ls
```

## トラブルシューティング

### ビルドエラーが発生した場合
1. ローカルで `npm run build` を実行してエラーを確認
2. エラーを修正
3. 再度コミット・プッシュ

### デプロイが自動的に開始されない場合
1. Vercelダッシュボードでプロジェクト設定を確認
2. GitHubリポジトリとの連携が正しく設定されているか確認
3. 必要に応じて手動で「Redeploy」を実行

## 参考
- リポジトリ: https://github.com/masayoshixxx/pokemon-party-weakness-checker
- Vercelダッシュボード: https://vercel.com/dashboard

