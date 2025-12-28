# Playwrightセットアップガイド

## エラーについて

### エラー: `EPERM: operation not permitted, scandir '/Users/msys/.Trash'`

このエラーは、PlaywrightがmacOSの`.Trash`ディレクトリにアクセスしようとして権限エラーが発生しているためです。

### 解決方法

#### 1. プロジェクトディレクトリで実行する（重要）

**間違い:**
```bash
# ホームディレクトリで実行（エラーが発生）
~ % npx playwright test
```

**正しい:**
```bash
# プロジェクトディレクトリに移動してから実行
cd /Users/msys/project-app
npm test
```

#### 2. Playwrightをインストール

```bash
# プロジェクトディレクトリで実行
cd /Users/msys/project-app

# Playwrightをインストール
npm install -D @playwright/test

# ブラウザをインストール
npx playwright install
```

#### 3. テストを実行

```bash
# 通常のテスト実行
npm test

# UIモードで実行（視覚的に確認できる）
npm run test:ui

# デバッグモードで実行
npm run test:debug
```

## テストの内容

### 1. コンソールエラー検出
- ブラウザのコンソールエラーを自動検出
- 404エラーやfaviconエラーは無視

### 2. CSS読み込み確認
- CSSファイルが正しく読み込まれているか確認
- コンテナのスタイルが適用されているか確認

### 3. テーマ切り替え確認
- テーマトグルボタンが正しく動作するか確認
- メニューが表示されるか確認

### 4. ボタンクリック確認
- 追加ボタンが正しく動作するか確認
- メンバーが追加されるか確認

## トラブルシューティング

### テストが失敗する場合

1. **開発サーバーが起動しているか確認**
   ```bash
   npm run dev
   ```

2. **ポート3000が使用されているか確認**
   ```bash
   lsof -i :3000
   ```

3. **キャッシュをクリア**
   ```bash
   npm run clean
   npm run dev
   ```

### 権限エラーが続く場合

1. **プロジェクトディレクトリで実行しているか確認**
   ```bash
   pwd
   # /Users/msys/project-app と表示されることを確認
   ```

2. **Playwrightのキャッシュをクリア**
   ```bash
   rm -rf ~/.cache/ms-playwright
   npx playwright install
   ```

## 今後の改善

- Visual Regression Testing（Percy）の導入
- エラー監視サービス（Sentry）の導入
- CI/CDでの自動テスト実行

