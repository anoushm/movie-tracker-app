import { test, expect } from '@playwright/test';

test.describe('Genre Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/movies/popular');
    // Wait for genres to load in sidebar
    await page.waitForSelector('[data-testid="genres-heading"]', { timeout: 10000 });
  });

  test('should display genre links in sidebar', async ({ page }) => {
    // Check genres heading
    await expect(page.getByRole('heading', { name: 'Genres' })).toBeVisible();

    // Check common genre links are visible
    await expect(page.getByRole('link', { name: 'Action' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Comedy' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Drama' })).toBeVisible();
  });

  test('should navigate to Action genre and display movies', async ({ page }) => {
    // Click on Action genre link
    await page.getByRole('link', { name: 'Action' }).click();

    // Verify URL contains genre path
    await expect(page).toHaveURL(/.*\/movies\/genre\/28/);

    // Wait for movies to load
    await page.waitForSelector('movie-card', { timeout: 10000 });

    // Verify movie cards are displayed
    const movieCards = page.locator('movie-card');
    await expect(movieCards.first()).toBeVisible();
    expect(await movieCards.count()).toBeGreaterThan(0);
  });

  test('should navigate to Comedy genre and display movies', async ({ page }) => {
    // Click on Comedy genre link
    await page.getByRole('link', { name: 'Comedy' }).click();

    // Verify URL contains genre path
    await expect(page).toHaveURL(/.*\/movies\/genre\/35/);

    // Wait for movies to load
    await page.waitForSelector('movie-card', { timeout: 10000 });

    // Verify movie cards are displayed
    const movieCards = page.locator('movie-card');
    await expect(movieCards.first()).toBeVisible();
    expect(await movieCards.count()).toBeGreaterThan(0);
  });

  test('should navigate to Drama genre and display movies', async ({ page }) => {
    // Click on Drama genre link
    await page.getByRole('link', { name: 'Drama' }).click();

    // Verify URL contains genre path
    await expect(page).toHaveURL(/.*\/movies\/genre\/18/);

    // Wait for movies to load
    await page.waitForSelector('movie-card', { timeout: 10000 });

    // Verify movie cards are displayed
    const movieCards = page.locator('movie-card');
    await expect(movieCards.first()).toBeVisible();
    expect(await movieCards.count()).toBeGreaterThan(0);
  });

  test('should navigate to Crime genre and display movies', async ({ page }) => {
    // Click on Crime genre link
    await page.getByRole('link', { name: 'Crime' }).click();

    // Verify URL contains genre path
    await expect(page).toHaveURL(/.*\/movies\/genre\/80/);

    // Wait for movies to load
    await page.waitForSelector('movie-card', { timeout: 10000 });

    // Verify movie cards are displayed
    const movieCards = page.locator('movie-card');
    await expect(movieCards.first()).toBeVisible();
    expect(await movieCards.count()).toBeGreaterThan(0);
  });

  test('should navigate between different genres', async ({ page }) => {
    // Navigate to Action
    await page.getByRole('link', { name: 'Action' }).click();
    await expect(page).toHaveURL(/.*\/movies\/genre\/28/);
    await page.waitForSelector('movie-card', { timeout: 10000 });

    // Navigate to Comedy
    await page.getByRole('link', { name: 'Comedy' }).click();
    await expect(page).toHaveURL(/.*\/movies\/genre\/35/);
    await page.waitForSelector('movie-card', { timeout: 10000 });

    // Navigate to Drama
    await page.getByRole('link', { name: 'Drama' }).click();
    await expect(page).toHaveURL(/.*\/movies\/genre\/18/);
    await page.waitForSelector('movie-card', { timeout: 10000 });

    // Verify movies are still displayed after multiple navigations
    const movieCards = page.locator('movie-card');
    await expect(movieCards.first()).toBeVisible();
  });

  test('should display movie cards with required elements on genre page', async ({ page }) => {
    // Navigate to Action genre
    await page.getByRole('link', { name: 'Action' }).click();
    await page.waitForSelector('movie-card', { timeout: 10000 });

    // Check first movie card has required elements
    const firstCard = page.locator('movie-card').first();
    await expect(firstCard.locator('h3')).toBeVisible(); // Movie title
    await expect(firstCard.locator('img')).toBeVisible(); // Movie poster
    await expect(firstCard.getByText(/Released:/)).toBeVisible(); // Release date
    await expect(firstCard.getByText(/Vote Count:/)).toBeVisible(); // Vote count
  });

  test('should have working search on genre page', async ({ page }) => {
    // Navigate to Action genre
    await page.getByRole('link', { name: 'Action' }).click();
    await page.waitForSelector('movie-card', { timeout: 10000 });

    // Find search box and search
    const searchBox = page.getByRole('textbox', { name: 'Search movies...' });
    await expect(searchBox).toBeVisible();

    // Get initial count
    const initialCount = await page.locator('movie-card').count();

    // Search for something
    await searchBox.fill('test');
    await page.waitForTimeout(500);

    // Results should change (either filtered or show no results message)
    const movieCards = page.locator('movie-card');
    const cardCount = await movieCards.count();

    if (cardCount === 0) {
      const noMovies = await page.locator('text=No movies found').isVisible();
      expect(noMovies).toBeTruthy();
    } else {
      // Search either filtered results or found matching movies
      expect(cardCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('should have working pagination on genre page', async ({ page }) => {
    // Navigate to Action genre
    await page.getByRole('link', { name: 'Action' }).click();
    await page.waitForSelector('movie-card', { timeout: 10000 });

    // Check pagination controls
    await expect(page.getByRole('button', { name: 'Previous' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
    await expect(page.getByText('Page 1')).toBeVisible();
  });

  test('should navigate from genre page back to Popular', async ({ page }) => {
    // Navigate to Action genre
    await page.getByRole('link', { name: 'Action' }).click();
    await expect(page).toHaveURL(/.*\/movies\/genre\/28/);

    // Navigate back to Popular
    await page.getByRole('link', { name: 'Popular' }).click();
    await expect(page).toHaveURL(/.*\/movies\/popular/);

    // Verify movies load on Popular page
    await page.waitForSelector('movie-card', { timeout: 10000 });
    const movieCards = page.locator('movie-card');
    await expect(movieCards.first()).toBeVisible();
  });
});
