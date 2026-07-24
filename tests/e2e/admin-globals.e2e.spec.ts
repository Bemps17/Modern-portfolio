import { test, expect } from '@playwright/test'
import { login } from '../helpers/login'
import { seedTestUser, cleanupTestUser, testUser } from '../helpers/seedUser'

test.describe('Admin globals forms', () => {
  test.beforeAll(async () => {
    await seedTestUser()
  })
  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('site-settings affiche siteName et email', async ({ page }) => {
    await login({ page, user: testUser })
    await page.goto('http://localhost:3000/admin/globals/site-settings')
    await expect(page.locator('input[name="siteName"]')).toBeVisible()
    await page
      .locator('.collapsible-field')
      .filter({ hasText: 'Contact' })
      .locator('.collapsible__toggle')
      .click()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="themeColor"]')).toBeVisible()
  })

  test('seo-defaults affiche defaultTitle et titleTemplate', async ({ page }) => {
    await login({ page, user: testUser })
    await page.goto('http://localhost:3000/admin/globals/seo-defaults')
    await expect(page.locator('input[name="defaultTitle"]')).toBeVisible()
    await expect(page.locator('input[name="titleTemplate"]')).toBeVisible()
  })
})
