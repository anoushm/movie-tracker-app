import { defineConfig, devices } from '@playwright/test';

/**
 * CI-specific Playwright configuration for Azure Static Web Apps
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: true,
  /* Retry on CI */
  retries: 2,
  /* Keep reasonable worker count */
  workers: 1,
  /* Reporter to use - avoid file output in CI */
  reporter: [['list'], ['github']],
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
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Timeout settings for CI */
  timeout: 30000,
  expect: {
    timeout: 10000,
  },

  /* No web server in CI - the app should already be deployed */
});
