#!/bin/bash

# 自動エラーチェックスクリプト
# 開発サーバーが起動していることを前提に、エラーを検出

echo "🔍 コンソールエラーを自動検出中..."

# 開発サーバーが起動しているか確認
if ! curl -s http://localhost:3001 > /dev/null 2>&1 && ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "❌ 開発サーバーが起動していません"
    echo "💡 'npm run dev' を実行してください"
    exit 1
fi

# ポートを検出
PORT=3000
if curl -s http://localhost:3001 > /dev/null 2>&1; then
    PORT=3001
fi

echo "✅ 開発サーバーがポート${PORT}で起動しています"

# Playwrightテストを実行
echo "🧪 Playwrightテストを実行中..."
BASE_URL=http://localhost:${PORT} npm run test:errors

if [ $? -eq 0 ]; then
    echo "✅ エラーは検出されませんでした"
else
    echo "❌ エラーが検出されました。詳細を確認してください"
    exit 1
fi

