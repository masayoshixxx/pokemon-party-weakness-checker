import { test, expect } from '@playwright/test';

/**
 * 基本的な機能の動作確認テスト
 * CSS読み込み、クリック動作、フォーム入力などを確認
 */
test.describe('基本的な機能の動作確認', () => {
  test('ページが正常に読み込まれる', async ({ page }) => {
    await page.goto('/');
    
    // タイトルが表示されているか
    await expect(page.locator('h1.title')).toContainText('ポケモンパーティ弱点チェッカー');
    
    // コンテナが存在するか
    await expect(page.locator('.container')).toBeVisible();
  });

  test('CSSが正しく適用されている', async ({ page }) => {
    await page.goto('/');
    
    // 背景色を確認
    const bodyBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    
    // 背景色が設定されているか（白または黒）
    expect(bodyBg).toMatch(/rgb\(250, 250, 250\)|rgb\(26, 26, 26\)/);
    
    // コンテナのスタイルを確認
    const containerStyle = await page.locator('.container').evaluate((el) => {
      return window.getComputedStyle(el).maxWidth;
    });
    expect(containerStyle).toBe('720px');
  });

  test('追加ボタンがクリックできる', async ({ page }) => {
    await page.goto('/');
    
    // 初期状態のメンバー数を取得
    const initialCount = await page.locator('.pokemon-member').count();
    
    // 追加ボタンをクリック
    await page.locator('.add-button').click();
    
    // メンバーが追加されたか確認
    await expect(page.locator('.pokemon-member')).toHaveCount(initialCount + 1);
  });

  test('提案ボタンがクリックできる', async ({ page }) => {
    await page.goto('/');
    
    // 初期状態のメンバー数を取得
    const initialCount = await page.locator('.pokemon-member').count();
    
    // 提案ボタンをクリック
    await page.locator('.suggest-button').click();
    
    // メンバーが追加されたか確認（提案が成功した場合）
    const newCount = await page.locator('.pokemon-member').count();
    expect(newCount).toBeGreaterThanOrEqual(initialCount);
  });

  test('テーマトグルボタンがクリックできる', async ({ page }) => {
    await page.goto('/');
    
    // テーマトグルボタンをクリック
    await page.locator('.theme-toggle').click();
    
    // メニューが表示されるか確認
    await expect(page.locator('.theme-menu')).toBeVisible();
    
    // メニューを閉じる
    await page.locator('.theme-toggle').click();
    await page.waitForTimeout(100);
    
    // メニューが非表示になったか確認
    const menuVisible = await page.locator('.theme-menu').isVisible().catch(() => false);
    expect(menuVisible).toBe(false);
  });

  test('タイプ選択が動作する', async ({ page }) => {
    await page.goto('/');
    
    // 最初のメンバーのタイプ1セレクトを取得
    const type1Select = page.locator('.pokemon-member').first().locator('select').first();
    
    // タイプを選択
    await type1Select.selectOption('ほのお');
    
    // 選択が反映されたか確認
    await expect(type1Select).toHaveValue('ほのお');
  });

  test('弱点計算についてボタンがクリックできる', async ({ page }) => {
    await page.goto('/');
    
    // 説明セクションが存在するか確認
    const explanationToggle = page.locator('.explanation-toggle');
    await expect(explanationToggle).toBeVisible();
    
    // クリックして説明を表示
    await explanationToggle.click();
    
    // 説明が表示されたか確認
    await expect(page.locator('.explanation-content')).toBeVisible();
    
    // 再度クリックして説明を非表示
    await explanationToggle.click();
    await page.waitForTimeout(100);
  });

  test('弱点表が表示される', async ({ page }) => {
    await page.goto('/');
    
    // 弱点表のタイトルが表示されているか
    await expect(page.locator('.weakness-table-title')).toContainText('パーティの弱点一覧');
    
    // 弱点セルが存在するか（18タイプ分）
    const cells = await page.locator('.weakness-cell').count();
    expect(cells).toBe(18);
  });
});

