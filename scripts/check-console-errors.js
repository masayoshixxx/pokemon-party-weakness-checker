/**
 * コンソールエラーを検出するスクリプト
 * Playwrightを使用してブラウザでエラーを検出
 */

const { chromium } = require('playwright');

async function checkConsoleErrors() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const errors = [];
  const warnings = [];
  const failedRequests = [];
  
  // コンソールメッセージをキャッチ
  page.on('console', msg => {
    const text = msg.text();
    const location = msg.location();
    
    if (msg.type() === 'error') {
      // 404エラーやfaviconエラーは無視
      if (!text.includes('404') && !text.includes('favicon') && !text.includes('Failed to load resource')) {
        errors.push({
          type: 'console.error',
          message: text,
          url: location.url,
          line: location.lineNumber,
          column: location.columnNumber,
        });
      }
    } else if (msg.type() === 'warning') {
      warnings.push({
        message: text,
        url: location.url,
      });
    }
  });
  
  // ページエラーをキャッチ
  page.on('pageerror', error => {
    errors.push({
      type: 'pageerror',
      message: error.message,
      stack: error.stack,
    });
  });
  
  // リクエストエラーをキャッチ
  page.on('requestfailed', request => {
    const url = request.url();
    const failure = request.failure();
    
    // 404エラーやfaviconエラーは無視
    if (!url.includes('favicon') && failure) {
      failedRequests.push({
        url: url,
        status: failure.statusCode || 0,
        statusText: failure.statusText || 'Unknown',
      });
    }
  });
  
  // ページにアクセス
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';
  console.log(`アクセス中: ${baseURL}`);
  
  try {
    await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 10000 });
  } catch (e) {
    console.error(`ページの読み込みに失敗: ${e.message}`);
    await browser.close();
    process.exit(1);
  }
  
  // 少し待ってからエラーを確認
  await page.waitForTimeout(2000);
  
  // インタラクションを実行してエラーを検出
  try {
    // テーマトグルボタンをクリック
    const themeToggle = page.locator('.theme-toggle');
    if (await themeToggle.count() > 0) {
      await themeToggle.click();
      await page.waitForTimeout(500);
      await themeToggle.click();
    }
  } catch (e) {
    // エラーは記録される
  }
  
  try {
    // 追加ボタンをクリック
    const addButton = page.locator('.add-button');
    if (await addButton.count() > 0) {
      await addButton.click();
      await page.waitForTimeout(500);
    }
  } catch (e) {
    // エラーは記録される
  }
  
  // エラーを出力
  console.log('\n' + '='.repeat(80));
  console.log('コンソールエラー検出結果');
  console.log('='.repeat(80));
  
  if (errors.length > 0) {
    console.log(`\n❌ エラー: ${errors.length}件\n`);
    errors.forEach((error, index) => {
      console.log(`[${index + 1}] ${error.type}`);
      console.log(`    メッセージ: ${error.message}`);
      if (error.url) console.log(`    URL: ${error.url}`);
      if (error.line) console.log(`    行: ${error.line}:${error.column}`);
      if (error.stack) console.log(`    スタック:\n${error.stack}`);
      console.log('');
    });
  } else {
    console.log('\n✅ エラーは検出されませんでした\n');
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  警告: ${warnings.length}件\n`);
    warnings.forEach((warning, index) => {
      console.log(`[${index + 1}] ${warning.message}`);
      if (warning.url) console.log(`    URL: ${warning.url}`);
      console.log('');
    });
  }
  
  if (failedRequests.length > 0) {
    console.log(`\n🔴 失敗したリクエスト: ${failedRequests.length}件\n`);
    failedRequests.forEach((req, index) => {
      console.log(`[${index + 1}] ${req.url}`);
      console.log(`    ステータス: ${req.status} ${req.statusText}`);
      console.log('');
    });
  }
  
  console.log('='.repeat(80) + '\n');
  
  await browser.close();
  
  // エラーがある場合は終了コード1を返す
  if (errors.length > 0) {
    process.exit(1);
  }
  
  process.exit(0);
}

checkConsoleErrors().catch(error => {
  console.error('エラー検出スクリプトの実行に失敗:', error);
  process.exit(1);
});

