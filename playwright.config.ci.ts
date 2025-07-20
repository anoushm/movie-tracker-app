import { defineConfig, devices } from '@playwright/test';
import * as os from 'os';

/**
 * CI-specific Playwright configuration for Azure Static Web Apps
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* Use system temp directory for outputs to avoid permission issues */
  outputDir: `${os.tmpdir()}/playwright-results`,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: true,
  /* Retry on CI only once to save time */
  retries: 1,
  /* Single worker for stability in CI */
  workers: 1,
  /* Minimal console reporter only */
  reporter: [['list']],
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL from environment variable - set by CI/CD pipeline */
    baseURL: process.env['PLAYWRIGHT_BASE_URL'] || process.env['AZURE_STATIC_WEB_APP_URL'] || 'http://localhost:4200',

    /* Disable file outputs in CI to avoid permission issues */
    trace: 'off',
    screenshot: 'off',
    video: 'off',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Timeout settings for CI */
  timeout: 30000,
  expect: {
    timeout: 10000,
  },

  /* No web server in CI - the app should already be deployed */
});
