# デプロイ前チェックリスト

## ✅ デプロイ前の確認事項

### 1. ローカルでのビルド確認
```bash
npm run build
```
エラーが発生しないことを確認してください。

### 2. ローカルでの起動確認
```bash
npm run start
```
本番環境と同じ状態で起動し、動作確認してください。

### 3. 環境変数の確認
現在のプロジェクトでは環境変数は使用していませんが、今後追加する場合は以下を確認：
- `.env.local` ファイルはGitにコミットしない（`.gitignore`に含まれている）
- 必要な環境変数はVercelの設定で追加する

### 4. 不要なファイルの確認
以下のファイルはデプロイに不要ですが、問題ありません：
- `tests/` ディレクトリ（Playwrightテスト）
- `scripts/` ディレクトリ（開発用スクリプト）
- `docs/` ディレクトリ（ドキュメント）

### 5. メタデータの確認
`app/layout.tsx` のメタデータが正しく設定されていることを確認：
- タイトル: 「ポケモンパーティ弱点チェッカー」
- 説明文: 「ポケモンのパーティを入力して、弱点を視覚的に確認できます」
- ファビコン: `/icon.svg`

## 🚀 クイックスタート（最短手順）

### ステップ1: Gitリポジトリの準備
```bash
cd /Users/msys/project-app
git init
git add .
git commit -m "Initial commit"
```

### ステップ2: GitHubにリポジトリを作成
1. https://github.com/new にアクセス
2. リポジトリ名を入力
3. 「Create repository」をクリック

### ステップ3: GitHubにプッシュ
```bash
git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git
git branch -M main
git push -u origin main
```

### ステップ4: Vercelでデプロイ
1. https://vercel.com にログイン
2. 「Add New...」→「Project」
3. GitHubリポジトリを選択
4. 「Deploy」をクリック

## 📝 注意事項

- **Node.jsバージョン**: Vercelは自動的に適切なバージョンを選択しますが、必要に応じて `package.json` に `engines` フィールドを追加できます
- **ビルド時間**: 初回ビルドは1-3分程度かかります
- **自動デプロイ**: GitHubにプッシュするたびに自動的に再デプロイされます

## 🔧 トラブルシューティング

### ビルドが失敗する場合
1. ローカルで `npm run build` を実行してエラーを確認
2. Vercelのビルドログを確認
3. 依存関係の問題の場合は `package-lock.json` をコミット

### ページが表示されない場合
1. ブラウザのコンソールでエラーを確認
2. Vercelのデプロイログを確認
3. ルーティングの問題がないか確認

