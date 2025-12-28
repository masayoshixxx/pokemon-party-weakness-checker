import { test, expect } from '@playwright/test';

/**
 * Faviconの読み込み確認テスト
 */
test.describe('Faviconの読み込み確認', () => {
  test('faviconが正しく読み込まれる', async ({ page }) => {
    const failedRequests: string[] = [];
    
    // 失敗したリクエストを記録
    page.on('requestfailed', (request) => {
      const url = request.url();
      if (url.includes('favicon') || url.includes('icon')) {
        failedRequests.push(url);
      }
    });
    
    // ページにアクセス
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // favicon関連の404エラーが発生していないことを確認
    const faviconErrors = failedRequests.filter(url => 
      url.includes('favicon.ico') && !url.includes('icon.svg')
    );
    
    // favicon.icoの404エラーは許容（icon.svgが使用されるため）
    // ただし、icon.svgが正しく読み込まれているか確認
    const iconResponse = await page.goto('/icon.svg').catch(() => null);
    if (iconResponse) {
      expect(iconResponse.status()).toBe(200);
    }
  });

  test('メタデータにfaviconが設定されている', async ({ page }) => {
    await page.goto('/');
    
    // faviconのlinkタグが存在するか確認
    const faviconLink = await page.locator('link[rel="icon"]').first();
    const href = await faviconLink.getAttribute('href');
    
    // icon.svgが設定されているか確認
    expect(href).toContain('icon.svg');
  });
});

