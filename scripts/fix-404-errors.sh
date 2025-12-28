#!/bin/bash

# Next.jsの404エラーを修正するスクリプト

echo "🔧 Next.jsの404エラーを修正中..."

# 1. .nextディレクトリを削除
echo "📦 ビルドキャッシュをクリア中..."
rm -rf .next

# 2. node_modules/.cacheを削除（存在する場合）
if [ -d "node_modules/.cache" ]; then
    echo "🗑️  node_modules/.cacheを削除中..."
    rm -rf node_modules/.cache
fi

# 3. 開発サーバーを再起動するための指示
echo ""
echo "✅ キャッシュのクリアが完了しました"
echo ""
echo "次のステップ:"
echo "1. 現在の開発サーバーを停止してください（Ctrl+C または Cmd+C）"
echo "2. 以下のコマンドで開発サーバーを再起動してください:"
echo "   npm run dev"
echo ""
echo "または、以下のコマンドで自動的に再起動できます:"
echo "   npm run dev:clean"

