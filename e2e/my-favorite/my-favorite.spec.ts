import { test, expect } from '@playwright/test';

test.describe('My Favorite Movies Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/movies/favorite');
  });

  test('should display my favorite movies page correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle('MovieTrackerApp');
    
    // Check URL
    await expect(page).toHaveURL(/.*\/movies\/favorite/);
    
    // Check that we're on the correct page
    await expect(page.getByRole('link', { name: 'My Favorite' })).toBeVisible();
  });

  test('should handle empty favorites list', async ({ page }) => {
    // Check if page loads without favorites
    const searchBox = page.getByRole('textbox', { name: 'Search movies...' });
    await expect(searchBox).toBeVisible();
    
    // Page should still show navigation and search functionality
    await expect(page.getByRole('link', { name: 'MoviesTracker' })).toBeVisible();
  });

  test('should show search functionality on favorites page', async ({ page }) => {
    // Search box should be available even on empty favorites
    const searchBox = page.getByRole('textbox', { name: 'Search movies...' });
    await expect(searchBox).toBeVisible();
    
    // Should be able to type in search box
    await searchBox.fill('test search');
    await expect(searchBox).toHaveValue('test search');
  });
});
