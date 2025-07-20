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
  /* Opt out of parallel tests on CI for stability */
  workers: 10,
  /* Reporter to use. */
  reporter: [['html'], ['github']],
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL from environment variable - set by CI/CD pipeline */
    baseURL: process.env['PLAYWRIGHT_BASE_URL'] || process.env['AZURE_STATIC_WEB_APP_URL'] || 'http://localhost:4200',

    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on retry */
    video: 'retain-on-failure',
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
