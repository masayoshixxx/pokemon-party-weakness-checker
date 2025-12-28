# Faviconテストの実行手順

## Playwrightのブラウザをインストール

以下のコマンドを実行して、すべてのブラウザをインストールしてください：

```bash
cd /Users/msys/project-app
npx playwright install
```

このコマンドは、Chromium、Firefox、WebKitのすべてのブラウザをインストールします。

## テストの実行

ブラウザのインストールが完了したら、以下のコマンドでテストを実行できます：

```bash
BASE_URL=http://localhost:3001 npm run test -- tests/favicon.spec.ts
```

## 手動での確認（推奨）

Playwrightのインストールが完了するまでの間、以下の手順で手動確認できます：

### 1. ブラウザでページを開く
- `http://localhost:3000` を開く
- 開発者ツール（F12）を開く

### 2. ネットワークタブで確認
1. 「ネットワーク」タブを開く
2. ページをリロード（Ctrl+R または Cmd+R）
3. 以下を確認：
   - `favicon.ico`のリクエストが404エラーになっていないか
   - `icon.svg`が200ステータスで読み込まれているか

### 3. Elementsタブで確認
1. 「Elements」タブを開く
2. `<head>`タグ内を確認
3. 以下が存在することを確認：
   ```html
   <link rel="icon" href="/icon.svg" type="image/svg+xml">
   ```

### 4. ブラウザのタブで確認
- ブラウザのタブにアイコン（⚡マーク）が表示されているか確認

## 期待される結果

✅ `favicon.ico`の404エラーが発生しない（または、`icon.svg`が使用される）
✅ ブラウザのタブにアイコンが表示される
✅ `/icon.svg`が200ステータスで読み込まれる
✅ `<head>`タグ内に`<link rel="icon">`が存在する

