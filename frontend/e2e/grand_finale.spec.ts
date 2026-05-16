import { test, expect } from '@playwright/test';

test.describe('SENTINEL_ONE Grand Finale Journey', () => {
  test('should complete the full autonomous orchestration flow', async ({ page }) => {
    // 1. Navigate to landing page
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/SENTINEL_ONE/i);

    // 2. Click "Open Dashboard" or "Launch Simulation"
    const launchButton = page.locator('text=Open Dashboard');
    await launchButton.click();

    // 3. Verify Dashboard components
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=Neural Command Center')).toBeVisible();

    // 4. Trigger Simulation
    const simulateButton = page.locator('text=Simulate Deployment');
    await simulateButton.click();

    // 5. Verify Monitoring Agent activation
    await expect(page.locator('text=[MONITORING]').first()).toBeVisible({ timeout: 20000 });
    await expect(page.locator('text=Latency spike detected').first()).toBeVisible({ timeout: 20000 });

    // 6. Verify Context Agent and RCA Agent activation
    await expect(page.locator('text=[CONTEXT]').first()).toBeVisible({ timeout: 25000 });
    await expect(page.locator('text=[RCA]').first()).toBeVisible({ timeout: 30000 });

    // 7. Verify Remediation and Execution
    await expect(page.locator('text=[REMEDIATION]').first()).toBeVisible({ timeout: 35000 });
    await expect(page.locator('text=[EXECUTION]').first()).toBeVisible({ timeout: 45000 });
    await expect(page.locator('text=Executing rollback').first()).toBeVisible();

    // 8. Verify Recovery
    await expect(page.locator('text=Recovery verified successfully').first()).toBeVisible({ timeout: 60000 });
    await expect(page.locator('text=All Systems Nominal').first()).toBeVisible({ timeout: 75000 });
  });
});
