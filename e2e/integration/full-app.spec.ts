import { test, expect } from '@playwright/test';

test.describe('Movie Tracker App - Full Integration Tests', () => {
  test('should handle responsive navigation across all pages', async ({ page }) => {
    const pages = [
      '/movies/popular',
      '/movies/top_rated',
      '/movies/favorite',
      '/movies/chatbot'
    ];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Check common navigation elements
      await expect(page.getByRole('link', { name: 'MoviesTracker' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Categories', level: 3 })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Genres', level: 3 })).toBeVisible();
      
      // Check genre links
      await expect(page.getByRole('link', { name: 'Action' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Comedy' })).toBeVisible();
    }
  });
});
