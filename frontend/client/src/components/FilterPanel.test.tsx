/**
 * FilterPanel Component Tests
 * Tests for click-outside and scroll-away behaviors
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FilterPanel from './FilterPanel'
import { SearchRequest } from '../types/search'

describe('FilterPanel', () => {
  const mockFilters: Partial<SearchRequest> = {
    sortBy: 'relevance',
    radiusKm: 20,
  }
  const mockOnFiltersChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders filter panel with toggle button', () => {
    render(
      <FilterPanel
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        hasUserLocation={true}
      />
    )

    expect(screen.getByText('Filters')).toBeInTheDocument()
  })

  it('expands filter panel when toggle button is clicked', () => {
    render(
      <FilterPanel
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        hasUserLocation={true}
      />
    )

    const toggleButton = screen.getByText('Filters').closest('button')
    fireEvent.click(toggleButton!)

    expect(screen.getByText('Price Range (Rand)')).toBeInTheDocument()
  })

  it('closes filter panel when clicking outside', async () => {
    render(
      <div>
        <div data-testid="outside-element">Outside</div>
        <FilterPanel
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
          hasUserLocation={true}
        />
      </div>
    )

    // Open the filter panel
    const toggleButton = screen.getByText('Filters').closest('button')
    fireEvent.click(toggleButton!)

    // Verify it's open
    expect(screen.getByText('Price Range (Rand)')).toBeInTheDocument()

    // Wait for the delay before click-outside handler is active
    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 150)))

    // Click outside
    const outsideElement = screen.getByTestId('outside-element')
    fireEvent.mouseDown(outsideElement)

    // Wait for state update
    await waitFor(() => {
      expect(screen.queryByText('Price Range (Rand)')).not.toBeInTheDocument()
    })
  })

  it('preserves filter selections when closing panel', async () => {
    const filtersWithSelections: Partial<SearchRequest> = {
      sortBy: 'price_low',
      radiusKm: 30,
      minPrice: 100,
      maxPrice: 500,
      minRating: 4,
      activityTypes: ['Beach', 'Hiking'],
      facilities: ['Free WiFi', 'Parking'],
    }

    render(
      <div>
        <div data-testid="outside-element">Outside</div>
        <FilterPanel
          filters={filtersWithSelections}
          onFiltersChange={mockOnFiltersChange}
          hasUserLocation={true}
        />
      </div>
    )

    // Open the filter panel
    const toggleButton = screen.getByText('Filters').closest('button')
    fireEvent.click(toggleButton!)

    // Verify active filters are displayed
    expect(screen.getByText('Beach')).toHaveClass('filter-chip-active')
    expect(screen.getByText('Hiking')).toHaveClass('filter-chip-active')

    // Wait for the delay
    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 150)))

    // Click outside to close
    const outsideElement = screen.getByTestId('outside-element')
    fireEvent.mouseDown(outsideElement)

    // Wait for close animation
    await waitFor(() => {
      expect(screen.queryByText('Price Range (Rand)')).not.toBeInTheDocument()
    })

    // Reopen and verify filters are still there
    fireEvent.click(toggleButton!)
    await waitFor(() => {
      expect(screen.getByText('Beach')).toHaveClass('filter-chip-active')
      expect(screen.getByText('Hiking')).toHaveClass('filter-chip-active')
    })
  })

  it('collapses filter panel when scrolling down', async () => {
    render(
      <FilterPanel
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        hasUserLocation={true}
      />
    )

    // Open the filter panel
    const toggleButton = screen.getByText('Filters').closest('button')
    fireEvent.click(toggleButton!)

    // Verify it's open
    expect(screen.getByText('Price Range (Rand)')).toBeInTheDocument()

    // Simulate scroll down past threshold
    Object.defineProperty(window, 'scrollY', { value: 150, writable: true })
    fireEvent.scroll(window)

    // Wait for state update
    await waitFor(() => {
      expect(screen.queryByText('Price Range (Rand)')).not.toBeInTheDocument()
    })
  })

  it('does not close when clicking inside filter panel', async () => {
    render(
      <FilterPanel
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        hasUserLocation={true}
      />
    )

    // Open the filter panel
    const toggleButton = screen.getByText('Filters').closest('button')
    fireEvent.click(toggleButton!)

    // Wait for the delay
    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 150)))

    // Click inside the filter panel
    const priceHeading = screen.getByText('Price Range (Rand)')
    fireEvent.mouseDown(priceHeading)

    // Verify it's still open
    await waitFor(() => {
      expect(screen.getByText('Price Range (Rand)')).toBeInTheDocument()
    })
  })

  it('displays active filter count badge', () => {
    const filtersWithMultiple: Partial<SearchRequest> = {
      minPrice: 100,
      maxPrice: 500,
      minRating: 4,
      activityTypes: ['Beach', 'Hiking'],
      facilities: ['Free WiFi'],
    }

    render(
      <FilterPanel
        filters={filtersWithMultiple}
        onFiltersChange={mockOnFiltersChange}
        hasUserLocation={true}
      />
    )

    // Should show badge with count: minPrice(1) + maxPrice(1) + minRating(1) + activityTypes(2) + facilities(1) = 6
    expect(screen.getByText('6')).toBeInTheDocument()
  })

  it('clears all filters when clear button is clicked', () => {
    const filtersWithSelections: Partial<SearchRequest> = {
      sortBy: 'price_low',
      minPrice: 100,
      maxPrice: 500,
    }

    render(
      <FilterPanel
        filters={filtersWithSelections}
        onFiltersChange={mockOnFiltersChange}
        hasUserLocation={true}
      />
    )

    const clearButton = screen.getByText('Clear all filters')
    fireEvent.click(clearButton)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      sortBy: 'relevance',
    })
  })
})
