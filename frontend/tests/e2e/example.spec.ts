import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  
  // Check that the main heading is visible
  await expect(page.getByRole('heading', { name: /enterprise scheduling platform/i })).toBeVisible();
  
  // Check that the sign in and get started buttons are present
  await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /get started/i })).toBeVisible();
  
  // Check that feature cards are displayed
  await expect(page.getByText(/smart scheduling/i)).toBeVisible();
  await expect(page.getByText(/enterprise security/i)).toBeVisible();
  await expect(page.getByText(/workflow automation/i)).toBeVisible();
});

test('navigation to login page works', async ({ page }) => {
  await page.goto('/');
  
  // Click the sign in button
  await page.getByRole('link', { name: /sign in/i }).click();
  
  // Should navigate to login page
  await expect(page).toHaveURL('/login');
});

test('navigation to signup page works', async ({ page }) => {
  await page.goto('/');
  
  // Click the get started button
  await page.getByRole('link', { name: /get started/i }).click();
  
  // Should navigate to signup page
  await expect(page).toHaveURL('/signup');
});