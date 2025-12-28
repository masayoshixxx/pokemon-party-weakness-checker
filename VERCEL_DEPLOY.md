# Vercelデプロイ手順

## 前提条件
- Vercelアカウントを持っていること
- GitHubアカウントを持っていること（GitLab、Bitbucketでも可）

## 手順

### 1. Gitリポジトリの初期化とGitHubへのプッシュ

#### 1-1. Gitリポジトリを初期化
```bash
cd /Users/msys/project-app
git init
```

#### 1-2. すべてのファイルをステージング
```bash
git add .
```

#### 1-3. 初回コミット
```bash
git commit -m "Initial commit: Pokemon Party Weakness Checker"
```

#### 1-4. GitHubでリポジトリを作成
1. GitHubにログイン
2. 右上の「+」ボタン → 「New repository」をクリック
3. リポジトリ名を入力（例: `pokemon-party-weakness-checker`）
4. 「Public」または「Private」を選択
5. 「Initialize this repository with a README」は**チェックしない**
6. 「Create repository」をクリック

#### 1-5. リモートリポジトリを追加してプッシュ
GitHubで作成したリポジトリのURLをコピーして、以下を実行：
```bash
git remote add origin https://github.com/あなたのユーザー名/pokemon-party-weakness-checker.git
git branch -M main
git push -u origin main
```

### 2. Vercelでのデプロイ

#### 2-1. Vercelにログイン
1. https://vercel.com にアクセス
2. 「Log in」をクリック
3. GitHubアカウントでログイン（推奨）

#### 2-2. 新しいプロジェクトを作成
1. ダッシュボードで「Add New...」→「Project」をクリック
2. 「Import Git Repository」で、先ほど作成したGitHubリポジトリを選択
3. 「Import」をクリック

#### 2-3. プロジェクト設定
Vercelが自動的にNext.jsプロジェクトを検出します。以下の設定を確認：

- **Framework Preset**: Next.js（自動検出）
- **Root Directory**: `./`（そのまま）
- **Build Command**: `npm run build`（自動設定）
- **Output Directory**: `.next`（自動設定）
- **Install Command**: `npm install`（自動設定）

#### 2-4. 環境変数の設定（今回は不要）
このプロジェクトでは環境変数は使用していないため、設定不要です。

#### 2-5. デプロイ実行
1. 「Deploy」ボタンをクリック
2. ビルドが開始されます（通常1-3分程度）
3. ビルドが完了すると、自動的にURLが生成されます

### 3. デプロイ後の確認

#### 3-1. デプロイURLの確認
- デプロイが完了すると、`https://プロジェクト名.vercel.app` というURLが生成されます
- このURLにアクセスして、アプリケーションが正常に動作するか確認してください

#### 3-2. カスタムドメインの設定（オプション）
必要に応じて、独自のドメインを設定できます：
1. プロジェクトの「Settings」→「Domains」を開く
2. ドメイン名を入力
3. DNS設定を指示に従って行う

### 4. 今後の更新方法

コードを更新したら、GitHubにプッシュするだけで自動的に再デプロイされます：

```bash
git add .
git commit -m "更新内容の説明"
git push
```

Vercelが自動的に変更を検知して、新しいデプロイを開始します。

## トラブルシューティング

### ビルドエラーが発生した場合
1. Vercelのダッシュボードで「Deployments」を開く
2. 失敗したデプロイをクリック
3. 「Build Logs」でエラー内容を確認
4. ローカルで `npm run build` を実行して、同じエラーが発生するか確認

### 環境変数が必要になった場合
1. プロジェクトの「Settings」→「Environment Variables」を開く
2. 変数名と値を追加
3. 再デプロイを実行

## 参考リンク
- [Vercel公式ドキュメント](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)

