import { test, expect } from '@playwright/test';

test.describe('Top Rated Movies Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/movies/top_rated');
  });

  test('should display top rated movies page correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle('MovieTrackerApp');
    
    // Check URL
    await expect(page).toHaveURL(/.*\/movies\/top_rated/);
    
    // Check that we're on the correct page
    await expect(page.getByRole('link', { name: 'Top Rated' })).toBeVisible();
  });

  test('should display classic highly-rated movies', async ({ page }) => {
    // Wait for movies to load
    await page.waitForSelector('movie-card', { timeout: 10000 });
    
    // Check for movie cards (should have multiple movies)
    const movieCards = page.locator('movie-card');
    await expect(movieCards).toHaveCount(20); // Typical page size
    
    // Look for some classic highly-rated movies
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('The Shawshank Redemption');
  });

  test('should have search functionality working on top rated page', async ({ page }) => {
    // Wait for movies to load
    await page.waitForSelector('movie-card', { timeout: 10000 });
    
    // Search for "The Godfather"
    const searchBox = page.getByRole('textbox', { name: 'Search movies...' });
    await searchBox.fill('the godfather');
    
    // Wait for search results
    await page.waitForTimeout(1000);
    
    // Should show Godfather movies
    await expect(page.getByRole('heading', { name: 'The Godfather', level: 3, exact: true })).toBeVisible();
  });

  test('should display movies with high vote counts', async ({ page }) => {
    // Wait for movies to load
    await page.waitForSelector('movie-card', { timeout: 10000 });
    
    // Check that movies have vote counts displayed
    const voteCountElements = page.getByText(/Vote Count: \d+/);
    await expect(voteCountElements.first()).toBeVisible();
  });

  test('should have working favorite functionality', async ({ page }) => {
    // Wait for movies to load
    await page.waitForSelector('movie-card', { timeout: 10000 });
    
    // Find first movie's favorite checkbox
    const firstCard = page.locator('movie-card').first();
    const checkboxId = await firstCard.locator('input[type="checkbox"]').getAttribute('id');
    const movieId = checkboxId?.replace('fav-checkbox-', '') || '';
    const favoriteCheckbox = page.getByTestId(`favorite-checkbox-${movieId}`);
    
    // Should be able to interact with favorite button
    await expect(favoriteCheckbox).toBeVisible();
  });

  test('should display release years for classic movies', async ({ page }) => {
    // Wait for movies to load
    await page.waitForSelector('movie-card', { timeout: 10000 });
    
    // Check that release years are shown
    const releaseYears = page.getByText(/Released: \d{4}/);
    await expect(releaseYears.first()).toBeVisible();
    
    // Check for some classic years
    const pageContent = await page.textContent('body');
    expect(pageContent).toMatch(/Released: 19\d{2}|Released: 20\d{2}/);
  });
});
