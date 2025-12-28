# Hydrationエラー修正サマリー

## 修正した問題

### Hydrationエラーの原因
サーバーサイドレンダリング（SSR）とクライアントサイドレンダリング（CSR）で、初期状態が異なっていたため、ReactのHydration時に不一致が発生していました。

### 具体的な問題点

1. **`usePokemonParty`フック**
   - 問題: `getInitialParty`関数が、サーバーサイドでは常にデフォルト値を返し、クライアントサイドではlocalStorageから読み込む可能性があった
   - 結果: SSRとCSRで異なる初期値が設定され、Hydrationエラーが発生

2. **`ThemeSelector`コンポーネント**
   - 問題: `mounted`状態に依存したアイコン表示が、SSRとCSRで異なる可能性があった
   - 結果: ボタンの内容が一致せず、Hydrationエラーが発生

## 実施した修正

### 1. `usePokemonParty`フックの修正

**変更前:**
```typescript
function getInitialParty(): Pokemon[] {
  if (typeof window === 'undefined') {
    return [createDefaultPokemon()];
  }
  // LocalStorageから読み込み...
}

const [party, setParty] = useState<Pokemon[]>(getInitialParty);
```

**変更後:**
```typescript
// SSRとCSRで同じ初期値を返すように修正
const [party, setParty] = useState<Pokemon[]>(() => [createDefaultPokemon()]);
const [isInitialized, setIsInitialized] = useState(false);

// LocalStorageから初期値を読み込む（Hydrationエラーを防ぐため、useEffectで実行）
useEffect(() => {
  if (typeof window === 'undefined' || isInitialized) return;
  // LocalStorageから読み込み...
}, [isInitialized]);
```

**修正内容:**
- `useState`の初期値を常にデフォルト値に統一
- LocalStorageからの読み込みを`useEffect`に移動（クライアントサイドでのみ実行）
- `isInitialized`フラグを追加して、初期化の重複を防止

### 2. `ThemeSelector`コンポーネントの修正

**変更内容:**
- ボタンに`suppressHydrationWarning`属性を追加
- マウント前は常に`SunIcon`を表示（SSRとCSRで同じ）

## 動作検証

### 手動での確認

1. ブラウザで `http://localhost:3000` を開く
2. 開発者ツール（F12）を開く
3. コンソールタブでHydrationエラーが表示されていないか確認
4. ページをリロード（Ctrl+R または Cmd+R）
5. 再度コンソールでエラーを確認

### 自動テストでの確認

```bash
# Hydrationエラーの検出テストを実行
BASE_URL=http://localhost:3001 npm run test -- tests/hydration-error.spec.ts
```

## 確認ポイント

✅ ページが正常に読み込まれる
✅ コンソールにHydrationエラーが表示されない
✅ リロード後もエラーが発生しない
✅ テーマ切り替え後もエラーが発生しない
✅ すべての機能が正常に動作する

## 予防策

1. **SSRとCSRで同じ初期値を返す**
   - `useState`の初期値は、常にサーバーサイドでもクライアントサイドでも同じ値を返すようにする
   - LocalStorageや`window`オブジェクトに依存する初期化は、`useEffect`で実行する

2. **`suppressHydrationWarning`の使用**
   - テーマやクライアントサイドの状態に依存する要素には、`suppressHydrationWarning`を追加する

3. **テストの実施**
   - Hydrationエラーを検出するテストを追加し、リグレッションを防ぐ

