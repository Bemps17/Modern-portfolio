import { test, expect } from '@playwright/test'
import { login } from '../helpers/login'
import { seedTestUser, cleanupTestUser, testUser } from '../helpers/seedUser'

test.describe('Admin dashboard layout', () => {
  test.beforeAll(async () => {
    await seedTestUser()
  })
  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('une seule carte Paramètres du site sur le dashboard', async ({ page }) => {
    await login({ page, user: testUser })
    await page.goto('http://localhost:3000/admin')
    await expect(page.getByRole('heading', { name: 'Paramètres du site' })).toHaveCount(1)
    await expect(page.locator('.portfolio-admin__welcome')).toHaveCount(1)
  })
})
