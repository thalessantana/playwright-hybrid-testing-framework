import { test, expect } from '@playwright/test';

test.describe('Conduit UI - Public Health Check', () => {
  test('should load home page with banner and navigation links', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Conduit/i);

    await expect(page.getByRole('heading', { name: 'conduit', exact: false })).toBeVisible();

    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
  });
});