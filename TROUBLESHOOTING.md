# トラブルシューティングガイド

## 404エラーが発生する場合

### 症状
```
GET http://localhost:3000/_next/static/css/app/layout.css?v=... 404 (Not Found)
GET http://localhost:3000/_next/static/chunks/main-app.js?v=... 404 (Not Found)
```

### 原因
Next.jsの開発サーバーが正しく起動していない、またはビルドキャッシュが破損している可能性があります。

### 解決方法

#### 1. 開発サーバーを再起動
```bash
# 現在のサーバーを停止（Ctrl+C または Cmd+C）
# その後、再度起動
npm run dev
```

#### 2. キャッシュをクリアして再起動
```bash
# .nextディレクトリを削除
rm -rf .next

# 再度起動
npm run dev
```

#### 3. node_modulesを再インストール（上記で解決しない場合）
```bash
# node_modulesとpackage-lock.jsonを削除
rm -rf node_modules package-lock.json

# 再インストール
npm install

# 開発サーバーを起動
npm run dev
```

## Cursorでのブラウザ連携とエラー検出

### 現在のCursorの機能

#### 1. **ブラウザ拡張機能（開発中）**
- Cursorは現在、ブラウザ拡張機能を提供していません
- ただし、開発者ツールのエラーを手動でコピーしてCursorに貼り付けることは可能です

#### 2. **推奨される外部サービス**

##### A. **Playwright / Puppeteer（E2Eテスト）**
- **用途**: ブラウザの自動操作とエラー検出
- **特徴**: 
  - ブラウザを自動で操作してテストを実行
  - コンソールエラーを自動で検出
  - スクリーンショットを取得して視覚的な差分を検出
- **デファクトスタンダード**: Playwright（Microsoft製）

##### B. **Sentry（エラー監視）**
- **用途**: 本番環境でのエラー監視
- **特徴**:
  - リアルタイムでエラーを検出・通知
  - エラーの詳細なスタックトレースを提供
  - ユーザー影響度を分析
- **デファクトスタンダード**: 業界標準のエラー監視サービス

##### C. **Visual Regression Testing（視覚的回帰テスト）**
- **サービス**: 
  - **Percy**（推奨）
  - **Chromatic**（Storybook連携）
  - **BackstopJS**（オープンソース）
- **用途**: 画面の崩れを自動検出
- **特徴**: スクリーンショットを比較して、視覚的な変更を検出

##### D. **Browser DevTools Protocol（CDP）**
- **用途**: ブラウザの開発者ツールに直接アクセス
- **実装**: PlaywrightやPuppeteerが内部で使用

### 推奨される実装方法

#### 1. **開発環境でのエラー検出（Playwright）**

```bash
# Playwrightをインストール
npm install -D @playwright/test
npx playwright install
```

```typescript
// tests/error-detection.spec.ts
import { test, expect } from '@playwright/test';

test('コンソールエラーがないことを確認', async ({ page }) => {
  const errors: string[] = [];
  
  // コンソールエラーをキャッチ
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  // ページにアクセス
  await page.goto('http://localhost:3000');
  
  // エラーがないことを確認
  expect(errors).toHaveLength(0);
});

test('CSSが正しく読み込まれていることを確認', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // CSSファイルが読み込まれているか確認
  const cssLoaded = await page.evaluate(() => {
    const stylesheets = Array.from(document.styleSheets);
    return stylesheets.length > 0;
  });
  
  expect(cssLoaded).toBe(true);
});
```

#### 2. **視覚的回帰テスト（Percy）**

```bash
# Percyをインストール
npm install -D @percy/cli @percy/playwright
```

```typescript
// tests/visual.spec.ts
import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test('ホームページの視覚的な確認', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await percySnapshot(page, 'Homepage');
});
```

#### 3. **エラー監視（Sentry）**

```bash
# Sentryをインストール
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  tracesSampleRate: 1.0,
});
```

### Cursorでの自動検出の実装

#### 方法1: Cursorのターミナル統合を使用
- Cursorのターミナルで`npm run dev`を実行
- ブラウザでページを開き、開発者ツールのエラーを確認
- エラーをコピーしてCursorに貼り付け

#### 方法2: カスタムスクリプトを作成
```bash
# scripts/check-errors.sh
#!/bin/bash
# 開発サーバーを起動して、エラーを監視
npm run dev 2>&1 | tee dev.log &
SERVER_PID=$!

# 少し待ってからページにアクセス
sleep 5
curl -s http://localhost:3000 > /dev/null

# エラーログを確認
if grep -i "error" dev.log; then
  echo "エラーが検出されました"
  kill $SERVER_PID
  exit 1
fi
```

### 今後の改善案

1. **GitHub Actionsで自動テスト**
   - プッシュ時に自動でPlaywrightテストを実行
   - エラーがあれば通知

2. **Visual Regression Testingの導入**
   - PercyやChromaticを使用して、視覚的な変更を自動検出

3. **エラー監視サービスの導入**
   - Sentryを使用して、本番環境でのエラーを監視

