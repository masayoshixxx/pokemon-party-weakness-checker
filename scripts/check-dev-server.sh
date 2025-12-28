#!/bin/bash

# Next.js開発サーバーのエラーチェックスクリプト

echo "🔍 Next.js開発サーバーの状態を確認中..."

# ポート3000が使用されているか確認
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ ポート3000でサーバーが起動しています"
else
    echo "❌ ポート3000でサーバーが起動していません"
    echo "💡 'npm run dev' を実行してください"
    exit 1
fi

# サーバーにアクセスしてエラーを確認
echo "🌐 サーバーにアクセスしてエラーを確認中..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)

if [ "$RESPONSE" = "200" ]; then
    echo "✅ サーバーは正常に応答しています"
else
    echo "❌ サーバーが正常に応答していません (HTTP $RESPONSE)"
    exit 1
fi

# CSSファイルが存在するか確認
echo "📦 ビルドファイルを確認中..."
if [ -d ".next/static/css" ]; then
    echo "✅ CSSファイルが存在します"
else
    echo "⚠️  CSSファイルが見つかりません。ビルドが必要かもしれません"
    echo "💡 '.next' ディレクトリを削除して 'npm run dev' を再実行してください"
fi

echo "✨ チェック完了"

