# 自動エラー検出と修正の仕組み

## 現在の実装

### 1. Playwrightテストによるエラー検出
- `tests/console-errors.spec.ts`: すべてのコンソールエラーを詳細に記録
- `tests/error-detection.spec.ts`: エラー検出テスト（改善版）

### 2. エラー検出スクリプト
- `scripts/check-console-errors.js`: Node.jsスクリプトでエラーを検出

## 実行方法

### エラー検出テストを実行
```bash
BASE_URL=http://localhost:3001 npm run test:errors
```

### エラー検出スクリプトを実行
```bash
BASE_URL=http://localhost:3001 npm run check:errors
```

## Cursorでの自動検出

### 現在の制限
- Cursorは直接ブラウザと連携できません
- 開発者ツールのエラーを自動で取得することはできません

### 推奨されるワークフロー

1. **開発中**
   - ファイルを保存するたびに、Playwrightテストを実行
   - エラーがあれば自動で検出

2. **CI/CDでの自動検出**
   - GitHub Actionsでプッシュ時に自動テスト
   - エラーがあれば通知

3. **手動での確認**
   - ブラウザの開発者ツール（F12）でエラーを確認
   - エラーをコピーしてCursorに貼り付け

## 今後の改善案

### 1. GitHub Actionsでの自動テスト
```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - run: npm test
```

### 2. Visual Regression Testing
- PercyやChromaticを使用して、視覚的な変更を自動検出

### 3. エラー監視サービス
- Sentryを使用して、本番環境でのエラーを監視

## 注意事項

- Playwrightのブラウザをインストールする必要があります: `npx playwright install`
- 開発サーバーが起動している必要があります: `npm run dev`
- ポートが異なる場合は、`BASE_URL`環境変数を設定してください

