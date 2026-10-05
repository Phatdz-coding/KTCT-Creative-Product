import { expect, test } from '@playwright/test'

test('classroom flow: run baseline, change the wage, compare A and B', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Bắt đầu thuyết trình' }).click()

  // Baseline run
  await page.getByRole('button', { name: 'Chạy mô phỏng' }).click()
  await expect(page.getByText('150%', { exact: true })).toBeVisible()
  await expect(page.getByText('5.000.000').first()).toBeVisible()
  await page.getByRole('button', { name: 'Lưu làm A' }).click()

  // Lower the wage and run again
  await page.getByRole('button', { name: /Giảm tiền công/ }).click()
  await page.getByRole('button', { name: 'Chạy mô phỏng' }).click()
  await expect(page.getByText('240,9%', { exact: true })).toBeVisible()
  await expect(page.getByText('880.000').first()).toBeVisible()
  await page.getByRole('button', { name: 'Lưu làm B' }).click()

  // Compare
  await page.getByRole('button', { name: 'So sánh A và B' }).click()
  await expect(page.getByRole('heading', { name: 'So sánh A và B' })).toBeVisible()
  const wages = page.getByRole('row', { name: /Tổng tiền công/ })
  await expect(wages).toContainText('1.200.000')
  await expect(wages).toContainText('880.000')
  await expect(wages).toContainText('−320.000')

  // Theory drawer opens and closes with the keyboard
  await page.getByRole('button', { name: 'Lý thuyết' }).click()
  await expect(page.getByRole('heading', { name: 'Lý thuyết & giả định' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('heading', { name: 'Lý thuyết & giả định' })).toBeHidden()
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('the result appears immediately, without the animation', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Bắt đầu thuyết trình' }).click()
    await page.getByRole('button', { name: 'Chạy mô phỏng' }).click()
    // The animated run takes about 3 seconds; this must be visible well before that.
    await expect(page.getByText('150%', { exact: true })).toBeVisible({ timeout: 500 })
  })
})
