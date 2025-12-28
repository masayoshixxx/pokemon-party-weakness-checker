/**
 * yakkun.comの検索ページからタイプIDを抽出するスクリプト
 */

const https = require('https');
const fs = require('fs');

https.get('https://yakkun.com/sv/zukan/search/', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    // optionタグからタイプIDを抽出
    const optionRegex = /<option[^>]*value="(\d+)"[^>]*>([^<]+)<\/option>/g;
    const matches = [];
    let match;
    
    while ((match = optionRegex.exec(data)) !== null) {
      const value = parseInt(match[1]);
      const text = match[2].trim();
      
      // タイプ名を含むoptionのみを抽出
      const typeNames = [
        'ノーマル', 'ほのお', 'みず', 'でんき', 'くさ', 'こおり',
        'かくとう', 'どく', 'じめん', 'ひこう', 'エスパー', 'むし',
        'いわ', 'ゴースト', 'ドラゴン', 'あく', 'はがね', 'フェアリー'
      ];
      
      if (typeNames.some(name => text.includes(name))) {
        matches.push({ id: value, text });
      }
    }
    
    console.log('yakkun.comのタイプIDマッピング:');
    matches.forEach(({ id, text }) => {
      console.log(`  ${id}: ${text}`);
    });
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});

