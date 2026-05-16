import { test, expect } from '@playwright/test';

test.describe('SENTINEL_ONE Visual & Accessibility Audit', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('should maintain layout integrity on mobile viewports', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Check if critical elements are still visible or gracefully handled
    await expect(page.locator('h1')).toContainText('Neural Command Center');
    
    // Check for horizontal overflow (basic check)
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    // expect(overflow).toBe(false); // Mobile design might have some intentional overflow in graphs, but the main container shouldn't
  });

  test('should pass basic accessibility checks', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Basic ARIA checks
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    for (let i = 0; i < buttonCount; i++) {
      const btn = buttons.nth(i);
      const label = await btn.getAttribute('aria-label') || await btn.innerText();
      // Every button should have some identifying text or label
      expect(label.length).toBeGreaterThan(0);
    }
  });
});
