import { test, expect } from '@playwright/test';
test('schedule visibility follows selected role', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByText('Jules Rivera', { exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('schedule.png'), fullPage: true });
  await page.getByRole('button', { name: 'Receptionist', exact: true }).click();
  await expect(page.getByText('Jules Rivera', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Ava Bennett', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Professional', exact: true }).click();
  await expect(page.getByRole('button', { name: /Noah Williams, Custom tattoo/ })).toHaveCount(0);
  await page.getByRole('button', { name: 'Jules Rivera', exact: true }).click();
  await expect(page.getByText('Not working today', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /open checkout/ })).toHaveCount(0);
});
test('appointment details and device-specific checkout', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await page.getByRole('button', { name: /Olivia Martin, Cut & style/ }).click();
  await expect(page.getByText('olivia@example.com', { exact: true })).toBeVisible();
  const tip = page.getByRole('textbox', { name: 'Tip amount in dollars' });
  if (testInfo.project.name === 'iPhone-layout') {
    await expect(page.getByRole('heading', { name: 'Appointment', exact: true })).toBeVisible();
    await expect(tip).toHaveCount(0);
    await expect(page.getByRole('button', { name: /checkout/i })).toHaveCount(0);
    await expect(page.getByText('$75.00', { exact: true })).toBeVisible();
    await expect(page.getByText('Appointment viewing only on iPhone. Payments are handled on the iPad.', { exact: true })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('appointment.png'), fullPage: true });
    await page.getByRole('button', { name: 'Close appointment' }).click();
    expect(errors).toEqual([]);
    return;
  }
  await tip.fill('-5');
  await page.getByRole('button', { name: 'Complete demo checkout' }).click();
  await expect(page.getByText('Please enter a valid tip amount.', { exact: true })).toBeVisible();
  await tip.fill('12.35');
  await expect(page.getByText('$87.35', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Complete demo checkout' }).click();
  await expect(page.getByText('Demo checkout completed for $87.35. No money was charged.', { exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('checkout.png'), fullPage: true });
  await page.getByRole('button', { name: 'Close checkout' }).click();
  await page.getByRole('button', { name: /Olivia Martin, Cut & style/ }).click();
  await expect(tip).toHaveValue('12.35');
  await expect(page.getByRole('button', { name: 'Demo checkout completed' })).toBeDisabled();
  expect(errors).toEqual([]);
});
