/**
 * yakkun.comの各タイプページからタイプ名を抽出するスクリプト
 * SSL証明書の問題を回避するため、httpsモジュールの設定を調整
 */

const https = require('https');

// SSL証明書の検証を無効化（開発環境のみ）
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const typeIds = Array.from({ length: 18 }, (_, i) => i);
const typeMap = {};

function fetchType(typeId) {
  return new Promise((resolve, reject) => {
    const url = `https://yakkun.com/sv/zukan/search/?type=${typeId}`;
    
    const options = {
      rejectUnauthorized: false, // SSL証明書の検証を無効化
    };
    
    https.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // 複数のパターンでタイプ名を抽出
        let typeName = null;
        
        // パターン1: 『タイプ名』タイプ
        const match1 = data.match(/『([^』]+)』タイプ/);
        if (match1) {
          typeName = match1[1];
        }
        
        // パターン2: タイプ：タイプ名
        if (!typeName) {
          const match2 = data.match(/タイプ[：:]\s*([^<\n]+)/);
          if (match2) {
            typeName = match2[1].trim();
          }
        }
        
        // パターン3: h1タグやtitleタグから抽出
        if (!typeName) {
          const match3 = data.match(/<h1[^>]*>([^<]+)タイプ/);
          if (match3) {
            typeName = match3[1].trim();
          }
        }
        
        // パターン4: titleタグから抽出
        if (!typeName) {
          const match4 = data.match(/<title[^>]*>([^<]+)<\/title>/);
          if (match4) {
            const title = match4[1];
            const typeMatch = title.match(/([^『]+)タイプ/);
            if (typeMatch) {
              typeName = typeMatch[1].trim();
            }
          }
        }
        
        // パターン5: ページ内のテキストから抽出
        if (!typeName) {
          // HTMLタグを除去してテキストのみを取得
          const textOnly = data.replace(/<[^>]+>/g, ' ');
          const typeMatch = textOnly.match(/([^『\s]+)タイプ[^の]*ポケモン/);
          if (typeMatch) {
            typeName = typeMatch[1].trim();
          }
        }
        
        if (typeName) {
          typeMap[typeId] = typeName;
          console.log(`Type ID ${typeId}: ${typeName}`);
        } else {
          // デバッグ用: HTMLの一部を表示
          const snippet = data.substring(0, 500);
          console.log(`Type ID ${typeId}: Not found (HTML snippet: ${snippet.substring(0, 100)}...)`);
        }
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Error fetching type ${typeId}:`, err.message);
      resolve(); // エラーでも続行
    });
  });
}

async function fetchAllTypes() {
  console.log('Fetching all type IDs from yakkun.com...\n');
  
  for (const typeId of typeIds) {
    await fetchType(typeId);
    // リクエスト間隔を空ける
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log('\n=== Complete Type ID Mapping ===');
  const sortedMap = Object.keys(typeMap)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .reduce((acc, key) => {
      acc[key] = typeMap[key];
      return acc;
    }, {});
  console.log(JSON.stringify(sortedMap, null, 2));
  
  // TypeScriptのマッピング形式で出力
  console.log('\n=== TypeScript Mapping ===');
  const pokemonTypes = [
    'ノーマル', 'ほのお', 'みず', 'でんき', 'くさ', 'こおり',
    'かくとう', 'どく', 'じめん', 'ひこう', 'エスパー', 'むし',
    'いわ', 'ゴースト', 'ドラゴン', 'あく', 'はがね', 'フェアリー'
  ];
  
  const reverseMap = {};
  Object.keys(typeMap).forEach(id => {
    const typeName = typeMap[id];
    if (pokemonTypes.includes(typeName)) {
      reverseMap[typeName] = parseInt(id);
    }
  });
  
  console.log('export const TYPE_ID_MAP: Record<PokemonType, number> = {');
  pokemonTypes.forEach(type => {
    const id = reverseMap[type] !== undefined ? reverseMap[type] : '?';
    console.log(`  '${type}': ${id},`);
  });
  console.log('};');
}

fetchAllTypes().catch(console.error);
