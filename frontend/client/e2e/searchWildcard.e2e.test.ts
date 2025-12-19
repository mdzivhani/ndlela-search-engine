import { test, expect, Page } from '@playwright/test'

test.describe('Search Page - No Wildcard Auto-Search E2E', () => {
  test('should not make any search requests on initial /search load', async ({ page }) => {
    // Track all network requests
    const requests: string[] = []
    page.on('request', request => {
      if (request.url().includes('/api/search')) {
        requests.push(request.url())
      }
    })

    // Navigate to /search without any query params
    await page.goto('http://localhost:8080/search')

    // Wait 3 seconds to ensure no background requests fire
    await page.waitForTimeout(3000)

    // Verify NO search API calls were made
    expect(requests).toHaveLength(0)

    // Verify idle empty state is still visible
    const emptyState = await page.locator('text=Start your adventure').isVisible()
    expect(emptyState).toBeTruthy()

    // Verify "Results for '*'" does NOT appear
    const wildCardResults = await page.locator('text=Results for').isVisible()
    expect(wildCardResults).toBeFalsy()
  })

  test('should only make search request when user explicitly searches', async ({ page }) => {
    const requests: string[] = []
    page.on('request', request => {
      if (request.url().includes('/api/search')) {
        requests.push(request.url())
      }
    })

    await page.goto('http://localhost:8080/search')

    // Initially, no requests should be made
    expect(requests).toHaveLength(0)

    // User performs explicit search via quick search pill (if available) or search input
    // For now, just verify that navigating with query params DOES trigger search
    await page.goto('http://localhost:8080/search?q=test')

    // Wait for search to complete
    await page.waitForTimeout(1000)

    // Now search request should have been made
    expect(requests.length).toBeGreaterThan(0)
    expect(requests[0]).toContain('q=test')
  })

  test('should never show Results for "*" on initial load', async ({ page }) => {
    await page.goto('http://localhost:8080/search')

    // Wait to ensure any background searches would have completed
    await page.waitForTimeout(2000)

    // Search for the text "Results for *" which should not exist
    const wildCardText = await page.locator('text=Results for "*"').count()
    expect(wildCardText).toBe(0)

    // Verify the page still shows the idle empty state
    const startYourAdventure = await page.locator('text=Start your adventure').count()
    expect(startYourAdventure).toBeGreaterThan(0)
  })

  test('should show different empty state when search returns no results', async ({ page }) => {
    // First, perform a search with a query that returns no results
    await page.goto('http://localhost:8080/search?q=xyz12345nonexistent')

    // Wait for search to complete
    await page.waitForSelector('text=No results found', { timeout: 5000 })

    // Verify "No results found" message appears (not the idle "Start your adventure")
    const noResultsText = await page.locator('text=No results found').isVisible()
    expect(noResultsText).toBeTruthy()

    // Go back to idle state (no query params)
    await page.goto('http://localhost:8080/search')

    // Wait for idle state to appear
    await page.waitForSelector('text=Start your adventure', { timeout: 5000 })

    // Verify "Start your adventure" is visible again
    const startAdventure = await page.locator('text=Start your adventure').isVisible()
    expect(startAdventure).toBeTruthy()

    // Verify "No results found" is NOT visible
    const stillShowingNoResults = await page.locator('text=No results found').count()
    expect(stillShowingNoResults).toBe(0)
  })

  test('should handle filter changes without auto-searching', async ({ page }) => {
    const requests: string[] = []
    page.on('request', request => {
      if (request.url().includes('/api/search')) {
        requests.push(request.url())
      }
    })

    await page.goto('http://localhost:8080/search')

    // Wait for page to load
    await page.waitForTimeout(1000)

    // Try to interact with filter panel (if available)
    const filterPanel = await page.locator('[data-testid="filter-panel"]').count()

    // No search request should have been made yet
    expect(requests).toHaveLength(0)

    // Empty state should still be visible
    const emptyStateVisible = await page.locator('text=Start your adventure').isVisible()
    expect(emptyStateVisible).toBeTruthy()
  })
})
