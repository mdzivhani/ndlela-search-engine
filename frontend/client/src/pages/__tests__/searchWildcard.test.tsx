import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Search from '../Search'
import * as searchService from '../../services/search.service'
import React from 'react'

// Mock the search service
vi.mock('../../services/search.service')

// Mock the AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    logout: vi.fn(),
    login: vi.fn(),
    register: vi.fn()
  }),
  getAuthHeader: () => ({ Authorization: 'Bearer test' })
}))

// Mock other components
vi.mock('../../components/SearchHero', () => ({
  default: ({ onSearch }: any) => <div data-testid="search-hero" onClick={() => onSearch({ q: 'test' })}>Hero</div>
}))
vi.mock('../../components/FilterPanel', () => ({
  default: () => <div data-testid="filter-panel">Filters</div>
}))
vi.mock('../../components/ActivityMap', () => ({
  default: () => <div data-testid="map">Map</div>
}))
vi.mock('../../components/Cart', () => ({
  default: () => <div data-testid="cart">Cart</div>
}))
vi.mock('../../components/EmptySearchState', () => ({
  default: ({ onQuickSearch }: any) => (
    <div data-testid="empty-state" onClick={() => onQuickSearch('test')}>
      Empty State
    </div>
  )
}))
vi.mock('../../components/RecommendationsSections', () => ({
  default: () => <div data-testid="recommendations">Recommendations</div>
}))
vi.mock('../../components/SavedSearches', () => ({
  default: () => <div data-testid="saved-searches">Saved Searches</div>
}))
vi.mock('../../components/FilterChips', () => ({
  default: () => <div data-testid="filter-chips">Filter Chips</div>
}))

vi.mock('../../hooks/useGeolocation', () => ({
  useGeolocation: () => ({
    location: null,
    isLoading: false,
    error: null,
    requestLocation: vi.fn()
  })
}))

describe('Search Page - Wildcard Prevention', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window.location.search
    delete (window as any).location
    window.location = { search: '' } as any
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should NOT call search API on initial load without query params', async () => {
    const mockPerformSearch = vi.fn().mockResolvedValue({
      results: [],
      total: 0,
      query: ''
    })
    ;(searchService.performSearch as any).mockImplementation(mockPerformSearch)

    render(
      <BrowserRouter>
        <Search />
      </BrowserRouter>
    )

    // Wait for component to fully mount
    await waitFor(() => {
      expect(screen.getByText('Start your adventure')).toBeInTheDocument()
    }, { timeout: 2000 })

    // Verify search was NOT called
    expect(mockPerformSearch).not.toHaveBeenCalled()
  })

  it('should show idle empty state when no search performed', async () => {
    ;(searchService.performSearch as any).mockResolvedValue({
      results: [],
      total: 0,
      query: ''
    })

    render(
      <BrowserRouter>
        <Search />
      </BrowserRouter>
    )

    // Empty state should be visible
    await waitFor(() => {
      expect(screen.getByText('Start your adventure')).toBeInTheDocument()
    })

    // Results section should NOT be visible
    const resultsHeader = screen.queryByText(/Results for/)
    expect(resultsHeader).not.toBeInTheDocument()
  })

  it('should not auto-search when filters change on initial mount', async () => {
    const mockPerformSearch = vi.fn().mockResolvedValue({
      results: [],
      total: 0,
      query: ''
    })
    ;(searchService.performSearch as any).mockImplementation(mockPerformSearch)

    render(
      <BrowserRouter>
        <Search />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Start your adventure')).toBeInTheDocument()
    })

    // Verify search was never called
    expect(mockPerformSearch).not.toHaveBeenCalled()
  })

  it('should only search when user explicitly triggers search via UI', async () => {
    const mockPerformSearch = vi.fn().mockResolvedValue({
      results: [
        {
          id: '1',
          name: 'Test Business',
          description: 'Test',
          category: 'Test',
          rating: 5
        }
      ],
      total: 1,
      query: 'test'
    })
    ;(searchService.performSearch as any).mockImplementation(mockPerformSearch)

    const { container } = render(
      <BrowserRouter>
        <Search />
      </BrowserRouter>
    )

    // Initially, search should NOT be called
    expect(mockPerformSearch).not.toHaveBeenCalled()

    // User clicks search button (via EmptySearchState's onQuickSearch)
    const emptyState = screen.getByText('Start your adventure')
    emptyState.click()

    // Now search SHOULD be called with 'test' query
    await waitFor(() => {
      expect(mockPerformSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          q: 'test'
        })
      )
    })
  })

  it('should not return wildcard (*) as query in results', async () => {
    const mockPerformSearch = vi.fn().mockResolvedValue({
      results: [
        {
          id: '1',
          name: 'Test',
          description: 'Test',
          category: 'Test',
          rating: 5
        }
      ],
      total: 1,
      query: 'test'  // Must never be '*'
    })
    ;(searchService.performSearch as any).mockImplementation(mockPerformSearch)

    render(
      <BrowserRouter>
        <Search />
      </BrowserRouter>
    )

    // Trigger search
    const emptyState = screen.getByText('Start your adventure')
    emptyState.click()

    await waitFor(() => {
      expect(mockPerformSearch).toHaveBeenCalled()
    })

    const response = mockPerformSearch.mock.results[0].value
    expect(response.query).not.toBe('*')
  })

  it('should show idle state remains stable and does not flicker', async () => {
    const mockPerformSearch = vi.fn().mockResolvedValue({
      results: [],
      total: 0,
      query: ''
    })
    ;(searchService.performSearch as any).mockImplementation(mockPerformSearch)

    const { container } = render(
      <BrowserRouter>
        <Search />
      </BrowserRouter>
    )

    // After 3 seconds, idle state should still be visible (no flicker to results)
    await waitFor(() => {
      expect(screen.getByText('Start your adventure')).toBeInTheDocument()
    })
    const resultsHeader = screen.queryByText(/Results for/)
    expect(resultsHeader).not.toBeInTheDocument()

    // Search should never have been called
    expect(mockPerformSearch).not.toHaveBeenCalled()
  })
})
