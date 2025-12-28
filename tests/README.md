# テスト実行ガイド

## 現在の状況

開発サーバーがポート3001で起動している場合、以下のいずれかの方法で対応してください。

## 方法1: ポート3000を空けて再起動（推奨）

```bash
# ポート3000を使用しているプロセスを停止
lsof -ti:3000 | xargs kill -9

# 開発サーバーを再起動
npm run dev
```

## 方法2: 環境変数でポートを指定

```bash
# ポート3001でテストを実行
BASE_URL=http://localhost:3001 npm test
```

## 方法3: Playwrightの設定を変更

`playwright.config.ts`の`baseURL`を変更：

```typescript
use: {
  baseURL: 'http://localhost:3001', // 3000から3001に変更
  trace: 'on-first-retry',
},
```

## テスト実行

### 通常のテスト実行
```bash
npm test
```

### UIモードで実行（視覚的に確認できる）
```bash
npm run test:ui
```

### デバッグモードで実行
```bash
npm run test:debug
```

## トラブルシューティング

### ポートが使用中の場合
```bash
# 使用中のポートを確認
lsof -i :3000
lsof -i :3001

# プロセスを停止
kill -9 <PID>
```

### テストが失敗する場合
1. 開発サーバーが起動しているか確認
2. 正しいポートでアクセスできるか確認
3. ブラウザで手動でアクセスして確認

