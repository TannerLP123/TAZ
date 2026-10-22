import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:8081', launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {} },
  projects: [{ name: 'iPad-layout', use: { viewport: { width: 1180, height: 820 } } }, { name: 'iPhone-layout', use: { viewport: { width: 390, height: 844 } } }],
  webServer: { command: 'npm run web -- --port 8081', url: 'http://127.0.0.1:8081', timeout: 120000, reuseExistingServer: !process.env.CI }
});
