/**
 * yakkun.comの各タイプページのHTMLを解析してタイプ名を抽出するスクリプト
 * 
 * 使用方法:
 * 1. ブラウザで https://yakkun.com/sv/zukan/search/?type=0 から type=17 まで各ページを開く
 * 2. 各ページのHTMLを保存するか、開発者ツールでタイプ名を確認する
 * 3. このスクリプトでHTMLファイルを解析する
 * 
 * または、ブラウザのコンソールで以下を実行:
 * document.querySelector('select[name="type_n[]"]')?.options を確認
 */

const fs = require('fs');
const path = require('path');

// 既知のマッピング
const knownMappings = {
  1: 'かくとう',
  2: 'ひこう',
  3: 'どく',
  4: 'じめん',
  5: 'いわ',
  11: 'くさ',
  16: 'あく',
};

console.log('既知のマッピング:');
Object.keys(knownMappings).sort((a, b) => parseInt(a) - parseInt(b)).forEach(id => {
  console.log(`  ${id}: ${knownMappings[id]}`);
});

console.log('\n残りのタイプIDを特定するには:');
console.log('1. ブラウザで https://yakkun.com/sv/zukan/search/?type=X を開く（Xは0-17）');
console.log('2. 開発者ツール（F12）を開く');
console.log('3. Elementsタブで、タイプ選択のselectタグを探す');
console.log('4. option要素のvalue属性とテキストを確認');
console.log('\nまたは、ブラウザのコンソールで以下を実行:');
console.log('Array.from(document.querySelectorAll(\'select[name="type_n[]"] option\')).forEach(opt => console.log(`${opt.value}: ${opt.textContent}`))');

