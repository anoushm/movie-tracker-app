# Movie Tracker App - E2E Testing

This document describes how to run end-to-end tests for the Movie Tracker application using Playwright.

## Prerequisites

1. Node.js (v18 or higher)
2. npm or yarn
3. Angular CLI

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run e2e:install
```

## Running Tests Locally

### 1. Start the Development Server
```bash
npm run start
```
This will start the Angular development server on `http://localhost:4200`.

### 2. Run E2E Tests

**Run all tests:**
```bash
npm run e2e
```

**Run tests in headed mode (visible browser):**
```bash
npm run e2e:headed
```

**Run specific test suites:**
```bash
# Run only popular movies tests
npx playwright test e2e/popular

# Run only chatbot tests
npx playwright test e2e/chatbot-search

# Run only favorites tests
npx playwright test e2e/my-favorite

# Run only top-rated tests
npx playwright test e2e/top-rated
```

**Run with custom base URL:**
```bash
PLAYWRIGHT_BASE_URL=http://localhost:4200 npm run e2e
```

## Running Tests in CI/CD

The tests are configured to run automatically in the Azure Static Web Apps CI/CD pipeline using the `playwright.config.ci.ts` configuration.

### Environment Variables for CI/CD

- `PLAYWRIGHT_BASE_URL`: The URL of the deployed application
- `AZURE_STATIC_WEB_APP_URL`: Alternative URL variable (fallback)

### CI Configuration

The tests use a different configuration for CI:

```bash
npm run e2e:ci
```

This uses `playwright.config.ci.ts` which:
- Disables the local web server
- Uses environment variables for the base URL
- Runs with CI-optimized settings (retries, timeouts, etc.)
- Generates artifacts for failed tests

## Test Structure

```
e2e/
├── popular/                  # Popular movies page tests
│   └── popular.spec.ts
├── top-rated/               # Top rated movies page tests
│   └── top-rated.spec.ts
├── my-favorite/             # Favorites page tests
│   └── my-favorite.spec.ts
├── chatbot-search/          # Chatbot functionality tests
│   └── chatbot-search.spec.ts
└── integration/             # Full app integration tests
    └── full-app.spec.ts
```

## Test Coverage

### Popular Movies Page
- ✅ Page loads correctly
- ✅ Movie cards display with all required elements
- ✅ Search functionality works
- ✅ Pagination controls are present
- ✅ Navigation sidebar functions
- ✅ Star ratings display

### Top Rated Movies Page
- ✅ Classic movies are displayed
- ✅ High vote counts are shown
- ✅ 5-star ratings for top movies
- ✅ Search filters work
- ✅ Favorite functionality works

### My Favorite Movies Page
- ✅ Empty state handling
- ✅ Add/remove favorites functionality
- ✅ State persistence across navigation
- ✅ Proper movie details display

### Chatbot Search Page
- ✅ Chatbot interface elements
- ✅ Release date calculations (53 years for The Godfather)
- ✅ IMDB rating responses (9.2 for The Godfather)
- ✅ Trailer video requests
- ✅ Conversation history maintenance
- ✅ Movie card generation from chat

### Integration Tests
- ✅ Full user journey through all features
- ✅ Navigation consistency across pages
- ✅ State persistence across browser refresh

## Debugging Tests

**Run tests with debug mode:**
```bash
npx playwright test --debug
```

**Generate and view test report:**
```bash
npm run e2e:report
```

**Run specific test with trace:**
```bash
npx playwright test e2e/chatbot-search --trace on
```

## Azure Static Web Apps Integration

The CI/CD pipeline automatically:

1. Builds the Angular application
2. Deploys to Azure Static Web Apps
3. Runs e2e tests against the deployed URL
4. Reports test results

### Environment Variables in CI

The Azure workflow sets:
```yaml
env:
  PLAYWRIGHT_BASE_URL: ${{ steps.builddeploy.outputs.static_web_app_url }}
```

This ensures tests run against the actual deployed application.

## Troubleshooting

### Common Issues

1. **Tests timeout waiting for movies to load:**
   - Increase timeout in test configuration
   - Check if the API endpoints are responding

2. **Favorite functionality tests fail:**
   - Clear browser storage between test runs
   - Check if local storage persistence is working

3. **Chatbot tests fail:**
   - Verify chatbot API is responding
   - Check network conditions for slower responses

### Local Development Tips

1. **Run app and tests in parallel:**
```bash
# Terminal 1
npm run start

# Terminal 2
npm run e2e:headed
```

2. **Debug specific failing tests:**
```bash
npx playwright test e2e/chatbot-search/chatbot-search.spec.ts --debug
```

3. **Update test expectations:**
   - Review test failures
   - Update selectors if UI has changed
   - Adjust timeouts for slower environments

## Configuration Files

- `playwright.config.ts` - Local development configuration
- `playwright.config.ci.ts` - CI/CD optimized configuration
- `.github/workflows/azure-static-web-apps-green-mud-037bbdc1e.yml` - Azure CI/CD workflow
