import { test, expect } from '@playwright/test';

test.describe('App - Sanity Checks', () => {
  test('loads successfully and displays title', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    // Check if the title "Florentine Factions" is visible
    const title = page.getByText('Florentine Factions', { exact: true });
    await expect(title).toBeVisible();
  });

  test('Visualization tab is active on load', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    // Check if the Visualization tab is active (has the class text-earth-orange)
    const visualizationTab = page.locator('button:has-text("Visualization")');
    
    // Verify the tab has the active class
    await expect(visualizationTab).toHaveClass(/text-earth-orange/);
  });
});
