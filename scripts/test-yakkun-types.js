/**
 * yakkun.comのタイプIDを調査するためのスクリプト
 * 各タイプの検索URLを生成して、正しいタイプIDを特定する
 */

const types = [
  'ノーマル',
  'ほのお',
  'みず',
  'でんき',
  'くさ',
  'こおり',
  'かくとう',
  'どく',
  'じめん',
  'ひこう',
  'エスパー',
  'むし',
  'いわ',
  'ゴースト',
  'ドラゴン',
  'あく',
  'はがね',
  'フェアリー',
];

// 既知のマッピング（くさ/じめんから）
// type_n[]=11 → くさ
// type_n[]=4 → じめん

// タイプの順序を推測
// POKEMON_TYPESの順序とyakkun.comのタイプIDの順序が一致している可能性がある
// または、yakkun.com独自の順序がある可能性がある

console.log('yakkun.comのタイプID調査');
console.log('既知の情報:');
console.log('  くさ = 11');
console.log('  じめん = 4');
console.log('\n各タイプの検索URL:');

types.forEach((type, index) => {
  // まず、POKEMON_TYPESの順序（0-17）で試す
  const url1 = `https://yakkun.com/sv/zukan/search/?search=1&type_n[]=${index}&type_mode[]=0&type_mode_ex[]=0`;
  console.log(`${type}: ${url1}`);
});

