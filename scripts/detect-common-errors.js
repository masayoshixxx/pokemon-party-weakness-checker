/**
 * 一般的なエラーを検出するスクリプト
 * コードを静的に分析して、よくあるエラーの原因を特定
 */

const fs = require('fs');
const path = require('path');

const errors = [];
const warnings = [];

// チェックするファイル
const filesToCheck = [
  'app/layout.tsx',
  'app/page.tsx',
  'components/ThemeSelector.tsx',
  'components/PokemonMember.tsx',
  'components/WeaknessTable.tsx',
  'hooks/useTheme.ts',
  'hooks/usePokemonParty.ts',
];

// エラーパターン
const errorPatterns = [
  {
    name: 'SSR時のdocument/windowアクセス',
    pattern: /(?:document|window)\.(?!addEventListener|removeEventListener|matchMedia)/,
    check: (content, file) => {
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (line.includes('document.') || line.includes('window.')) {
          if (!line.includes('typeof window') && !line.includes('typeof document')) {
            if (!line.includes('useEffect') && !line.includes('useCallback') && !line.includes('useMemo')) {
              if (line.trim().startsWith('const') || line.trim().startsWith('let') || line.trim().startsWith('var')) {
                errors.push({
                  file,
                  line: index + 1,
                  message: 'SSR時に実行される可能性があるコードでdocument/windowにアクセスしています',
                  code: line.trim(),
                });
              }
            }
          }
        }
      });
    },
  },
  {
    name: 'useEffectの依存配列の不足',
    pattern: /useEffect\(\(\) => \{/,
    check: (content, file) => {
      const lines = content.split('\n');
      let inUseEffect = false;
      let useEffectLine = 0;
      let dependencies = [];
      
      lines.forEach((line, index) => {
        if (line.includes('useEffect(() => {')) {
          inUseEffect = true;
          useEffectLine = index + 1;
        }
        if (inUseEffect && line.includes('}, [')) {
          const depsMatch = line.match(/\[(.*?)\]/);
          if (depsMatch) {
            dependencies = depsMatch[1].split(',').map(d => d.trim()).filter(d => d);
          }
          inUseEffect = false;
        }
        if (inUseEffect && line.includes('}, []')) {
          // 空の依存配列をチェック
          const hasDeps = content.substring(content.indexOf('useEffect'), content.indexOf('}, []'))
            .match(/(?:party|theme|mounted|showMenu|pokemon)/);
          if (hasDeps) {
            warnings.push({
              file,
              line: useEffectLine,
              message: 'useEffectに空の依存配列がありますが、使用している変数があります',
            });
          }
          inUseEffect = false;
        }
      });
    },
  },
  {
    name: '未定義の変数や関数',
    pattern: /(?:const|let|var)\s+(\w+)\s*=/,
    check: (content, file) => {
      // 基本的なチェック（より詳細なチェックはTypeScriptが行う）
    },
  },
];

// ファイルをチェック
filesToCheck.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    errorPatterns.forEach(pattern => {
      if (pattern.check) {
        pattern.check(content, file);
      }
    });
  } else {
    warnings.push({
      file,
      message: `ファイルが見つかりません: ${file}`,
    });
  }
});

// 結果を出力
console.log('\n' + '='.repeat(80));
console.log('コード静的解析結果');
console.log('='.repeat(80));

if (errors.length > 0) {
  console.log(`\n❌ エラー: ${errors.length}件\n`);
  errors.forEach((error, index) => {
    console.log(`[${index + 1}] ${error.file}:${error.line}`);
    console.log(`    メッセージ: ${error.message}`);
    if (error.code) console.log(`    コード: ${error.code}`);
    console.log('');
  });
} else {
  console.log('\n✅ エラーは検出されませんでした\n');
}

if (warnings.length > 0) {
  console.log(`\n⚠️  警告: ${warnings.length}件\n`);
  warnings.forEach((warning, index) => {
    console.log(`[${index + 1}] ${warning.file}${warning.line ? `:${warning.line}` : ''}`);
    console.log(`    メッセージ: ${warning.message}`);
    console.log('');
  });
}

console.log('='.repeat(80) + '\n');

// エラーがある場合は終了コード1を返す
process.exit(errors.length > 0 ? 1 : 0);

