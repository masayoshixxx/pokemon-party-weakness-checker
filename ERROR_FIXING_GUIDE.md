# コンソールエラー修正ガイド

## エラー検出方法

### 1. 詳細なエラーレポートを取得

```bash
BASE_URL=http://localhost:3001 npm run test:errors
```

このコマンドを実行すると、すべてのコンソールエラー、警告、失敗したリクエストが詳細に記録されます。

### 2. エラーの種類

#### A. コンソールエラー（console.error）
- JavaScriptの実行エラー
- Reactのエラー
- その他のランタイムエラー

#### B. ページエラー（pageerror）
- 未キャッチの例外
- グローバルエラー

#### C. 失敗したリクエスト（requestfailed）
- 404エラー（ファイルが見つからない）
- 500エラー（サーバーエラー）
- ネットワークエラー

## エラー修正の手順

### ステップ1: エラーを検出
```bash
BASE_URL=http://localhost:3001 npm run test:errors
```

### ステップ2: エラーの詳細を確認
テストの出力を確認して、以下の情報を取得：
- エラーメッセージ
- エラーが発生したURL
- スタックトレース

### ステップ3: エラーを修正
エラーの種類に応じて修正：

#### 404エラーの場合
- ファイルパスを確認
- インポートパスを確認
- 静的ファイルのパスを確認

#### JavaScriptエラーの場合
- コードの構文エラーを確認
- 未定義の変数や関数を確認
- 型エラーを確認

#### Reactエラーの場合
- コンポーネントのpropsを確認
- フックの使用を確認
- レンダリングエラーを確認

## よくあるエラーと修正方法

### 1. 404エラー（ファイルが見つからない）

**エラー例:**
```
GET http://localhost:3000/_next/static/css/app/layout.css 404 (Not Found)
```

**修正方法:**
- 開発サーバーを再起動
- `.next`ディレクトリを削除して再ビルド
- ファイルパスを確認

### 2. Hydrationエラー

**エラー例:**
```
Hydration failed because the initial UI does not match what was rendered on the server.
```

**修正方法:**
- `suppressHydrationWarning`を追加
- サーバーサイドとクライアントサイドで同じHTMLを生成
- `useEffect`でクライアントサイドのみで実行する処理を分離

### 3. 未定義の変数や関数

**エラー例:**
```
ReferenceError: xxx is not defined
```

**修正方法:**
- 変数や関数の定義を確認
- インポート文を確認
- スコープを確認

## エラー修正後の確認

修正後、再度テストを実行してエラーが解消されたか確認：

```bash
BASE_URL=http://localhost:3001 npm test
```

すべてのテストが成功すれば、エラーは修正されています。

