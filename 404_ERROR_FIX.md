# 404エラー修正ガイド

## 問題の症状

以下のような404エラーが発生している場合：

```
GET http://localhost:3000/_next/static/css/app/layout.css?v=... 404 (Not Found)
GET http://localhost:3000/_next/static/chunks/main-app.js?v=... 404 (Not Found)
```

## 原因

Next.jsの開発サーバーが正しく起動していない、またはビルドキャッシュが破損している可能性があります。

## 解決方法

### 方法1: クリーンビルド（推奨）

```bash
# 1. 現在の開発サーバーを停止（Ctrl+C または Cmd+C）

# 2. ビルドキャッシュをクリア
npm run clean

# 3. 開発サーバーを再起動
npm run dev
```

または、一括で実行：

```bash
npm run dev:clean
```

### 方法2: 手動でキャッシュをクリア

```bash
# .nextディレクトリを削除
rm -rf .next

# node_modules/.cacheを削除（存在する場合）
rm -rf node_modules/.cache

# 開発サーバーを再起動
npm run dev
```

### 方法3: スクリプトを使用

```bash
# 修正スクリプトを実行
./scripts/fix-404-errors.sh

# その後、開発サーバーを再起動
npm run dev
```

## 確認事項

### 1. 開発サーバーが正しく起動しているか

ブラウザで `http://localhost:3000` にアクセスして、以下を確認：

- ページが表示されるか
- コンソールにエラーが表示されていないか
- ネットワークタブで404エラーが発生していないか

### 2. ポートが正しく使用されているか

```bash
# ポート3000が使用されているか確認
lsof -ti:3000
```

### 3. ビルドファイルが生成されているか

```bash
# .nextディレクトリが存在するか確認
ls -la .next

# 静的ファイルが生成されているか確認
ls -la .next/static
```

## 根本的な解決策

### Next.jsの設定を確認

`next.config.js`が正しく設定されているか確認：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

### CSSのインポートを確認

`app/layout.tsx`でCSSが正しくインポートされているか確認：

```typescript
import './globals.css';
```

## トラブルシューティング

### 問題が解決しない場合

1. **node_modulesを再インストール**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

2. **Next.jsのバージョンを確認**
   ```bash
   npm list next
   ```

3. **ポートを変更して試す**
   ```bash
   PORT=3001 npm run dev
   ```

## 予防策

- 開発サーバーを停止する際は、必ずCtrl+C（またはCmd+C）で正常に停止する
- 定期的に`.next`ディレクトリをクリアする
- エラーが発生した場合は、まずキャッシュをクリアしてから再試行する

