import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright設定ファイル
 * コンソールエラーやCSS読み込みを自動検出するテストを実行
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.BASE_URL 
    ? undefined // 既存のサーバーを使用する場合はwebServerを無効化
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
      },
  // macOSの.Trashディレクトリへのアクセスエラーを回避
  globalSetup: undefined,
});

