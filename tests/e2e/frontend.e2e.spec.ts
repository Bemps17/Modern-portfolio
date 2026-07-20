import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Bertrand|Portfolio/i)

    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible()
  })

  test('can navigate to projects', async ({ page }) => {
    await page.goto('http://localhost:3000/projets')
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })
})
