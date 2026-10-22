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
    await expect(page.getByRole('button', { name: 'Checkout', exact: true })).toBeDisabled();
    await expect(page.getByText('$75.00', { exact: true })).toBeVisible();
    await expect(page.getByText('Checkout is available on iPad only.', { exact: true })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('appointment.png'), fullPage: true });
    await page.getByRole('button', { name: 'Close appointment' }).click();
    expect(errors).toEqual([]);
    return;
  }
  await page.getByRole('button', { name: 'Checkout', exact: true }).click();
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
  await page.getByRole('button', { name: 'Checkout', exact: true }).click();
  await expect(tip).toHaveValue('12.35');
  await expect(page.getByRole('button', { name: 'Demo checkout completed' })).toBeDisabled();
  expect(errors).toEqual([]);
});

for (const role of ['Owner', 'Receptionist', 'Professional']) {
  test(`${role} can add and edit an appointment without double booking`, async ({page}) => {
    await page.goto('/');
    await expect(page.getByText('$860.00', {exact:true})).toHaveCount(0);
    await page.getByRole('button', {name:role,exact:true}).click();
    await page.getByRole('button', {name:'Add appointment',exact:false}).first().click();
    await page.getByRole('textbox', {name:'Customer name',exact:true}).fill('Taylor Test');
    await page.getByRole('textbox', {name:'Service',exact:true}).fill('Consultation');
    await page.getByRole('textbox', {name:'Service price in dollars'}).fill('30');
    if(role==='Professional') await expect(page.getByTestId('appointment-editor').getByRole('button',{name:'Marcus Reed',exact:true})).toHaveCount(0);
    await page.getByRole('button',{name:'9:00 AM',exact:true}).click();
    await page.getByRole('button',{name:'Save appointment',exact:true}).click();
    await expect(page.getByText('This professional already has an appointment at that time. Choose another time.',{exact:true})).toBeVisible();
    await page.getByRole('button',{name:'10:00 AM',exact:true}).click();
    await page.getByRole('button',{name:'Save appointment',exact:true}).click();
    const appointment=page.getByRole('button',{name:/Taylor Test, Consultation/});
    await expect(appointment).toBeVisible();
    await appointment.click();
    await page.getByRole('button',{name:'Edit appointment',exact:true}).click();
    await expect(page.getByRole('textbox',{name:'Customer name',exact:true})).toHaveValue('Taylor Test');
    await page.getByRole('textbox',{name:'Customer name',exact:true}).fill('Taylor Updated');
    await page.getByRole('button',{name:'Save appointment',exact:true}).click();
    await expect(page.getByRole('button',{name:/Taylor Updated, Consultation/})).toBeVisible();
    await expect(appointment).toHaveCount(0);
  });
}
test('empty slot preselects time and cancellation saves nothing', async ({page})=>{
  await page.goto('/');
  await page.getByRole('button',{name:'Add appointment for Ava Bennett at 10:30 AM',exact:true}).click();
  await expect(page.getByRole('button',{name:'10:30 AM',exact:true})).toHaveAttribute('aria-selected','true');
  await page.getByRole('textbox',{name:'Customer name',exact:true}).fill('Not saved');
  await page.getByRole('button',{name:'Cancel appointment changes'}).click();
  await expect(page.getByRole('button',{name:/Not saved,/})).toHaveCount(0);
});
for (const [role, name] of [['Owner','Morgan Ellis'],['Receptionist','Jamie Brooks'],['Professional','Ava Bennett']]) {
  test(`${role} cancellation prefills identity and requires every field`, async ({page},testInfo)=>{
    await page.goto('/');
    await page.getByRole('button',{name:role,exact:true}).click();
    const appointment=page.getByRole('button',{name:/Olivia Martin, Cut & style/});
    await appointment.click();
    await page.getByRole('button',{name:'Cancel appointment',exact:true}).click();
    const nameField=page.getByRole('textbox',{name:'Name',exact:true});
    const roleField=page.getByRole('textbox',{name:'Role',exact:true});
    const reason=page.getByRole('textbox',{name:'Reason for Canceling:',exact:true});
    const confirm=page.getByRole('button',{name:'Confirm',exact:true});
    await expect(nameField).toHaveValue(name);
    await expect(roleField).toHaveValue(role);
    await expect(confirm).toBeDisabled();
    await reason.fill('   ');
    await expect(confirm).toBeDisabled();
    await reason.fill('Customer requested a different day.');
    await expect(confirm).toBeEnabled();
    for (const [field,value] of [[nameField,name],[roleField,role]]) {
      await field.fill(' ');
      await expect(confirm).toBeDisabled();
      await field.fill(value);
      await expect(confirm).toBeEnabled();
    }
    await page.screenshot({path:testInfo.outputPath('cancel-appointment.png'),fullPage:true,animations:'disabled'});
    await page.getByRole('button',{name:'Cancel',exact:true}).click();
    await expect(page.getByRole('button',{name:'Edit appointment',exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Close appointment',exact:true}).click();
    await expect(appointment).toBeVisible();
    await appointment.click();
    await page.getByRole('button',{name:'Cancel appointment',exact:true}).click();
    await expect(reason).toHaveValue('');
    await reason.fill('Customer requested a different day.');
    await confirm.click();
    await expect(appointment).toHaveCount(0);
    await expect(page.getByText('Appointment for Olivia Martin canceled.',{exact:true})).toBeVisible();
    // The canceled booking must also release its time for a replacement.
    await page.getByRole('button',{name:'Add appointment for Ava Bennett at 9:00 AM',exact:true}).click();
    await page.getByRole('textbox',{name:'Customer name',exact:true}).fill('Replacement Customer');
    await page.getByRole('textbox',{name:'Service',exact:true}).fill('Cut');
    await page.getByRole('button',{name:'Save appointment',exact:true}).click();
    await expect(page.getByRole('button',{name:/Replacement Customer, Cut,/})).toBeVisible();
  });
}
