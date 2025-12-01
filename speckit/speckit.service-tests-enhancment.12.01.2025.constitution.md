# SpecKit Constitution for Movie Tracker App

Angular 19 Movie Tracker application using TypeScript strict mode.

## Philosophy
- KEEP IT SIMPLE at all times (coding, architecture, design, patterns, structure)
- Follow Clean Code and SOLID principles (Single Responsibility, Open-Closed)
- Use design patterns appropriately: Singleton for services, Factory for object creation, Decorator for extending behavior

## Angular Patterns
- Use standalone components exclusively
- Use inject() function for dependency injection (not constructor injection)
- Use Angular signals for reactive state
- Use OnPush change detection strategy
- Follow Angular latest best practices

## Service Design
- Single Responsibility: one service handles one domain (movies, auth, user preferences)
- Separate HTTP calls (*ApiService) from business logic (*Service) when complexity warrants
- Keep services focused and small
- Prefer composition over inheritance

## Naming & Structure
- Files: kebab-case (movie-list.service.ts, movie-detail.component.ts)
- Classes: PascalCase (MovieListService, MovieDetailComponent)
- Methods/properties: camelCase
- Interfaces: no "I" prefix
- Feature-based folder structure: features/{feature}/

## Code Quality
- No any types
- Prefer readonly and const
- Keep methods short and focused
- Maximum one level of nesting in conditionals when possible
- Descriptive variable and method names
- No comments in code - use self-documenting code with descriptive names. If code needs a comment, refactor it instead

## Testing
- E2E tests only using Playwright
- Test files located in /e2e folder at project root
- Descriptive test names: should [action] when [condition]

## Playwright E2E Test Guidelines

### Test Structure
- One spec file per feature or user journey
- Group related tests using `test.describe()`
- Use `test.beforeEach()` for common setup
- Use page object pattern for complex interactions

### Test Naming
- Format: `test('should [expected behavior] when [condition]', ...)`
- Be specific and descriptive
- Examples:
  - `test('should display movie list when navigating to popular page', ...)`
  - `test('should add movie to favorites when clicking favorite button', ...)`

### Best Practices
- Use data-testid attributes for selectors when possible
- Avoid brittle CSS selectors (prefer semantic queries)
- Test user behavior, not implementation details
- Keep tests independent and isolated
- Use Playwright's auto-waiting features
- Handle async operations properly with await
- Use appropriate assertions from @playwright/test

### Test Organization
```
e2e/
  ├── [feature-name]/
  │   └── [feature-name].spec.ts
  └── integration/
      └── full-app.spec.ts
```

### Page Object Example
```typescript
class MovieListPage {
  constructor(private readonly page: Page) {}
  
  async goto() {
    await this.page.goto('/popular');
  }
  
  async getMovieCards() {
    return this.page.locator('[data-testid="movie-card"]');
  }
}
```

### Assertions
- Use expect() from @playwright/test
- Verify visible elements: `await expect(element).toBeVisible()`
- Check text content: `await expect(element).toHaveText('Expected')`
- Validate counts: `await expect(elements).toHaveCount(10)`
- Wait for navigation: `await expect(page).toHaveURL(/pattern/)`

### Configuration
- Base URL: http://localhost:4200
- Run locally: `npm run e2e:local`
- Run headed: `npm run e2e:headed`
- CI mode: `npm run e2e:ci`
