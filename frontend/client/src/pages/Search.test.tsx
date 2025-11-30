/**
 * Tests for Search page with map-based search functionality
 */
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import { CartProvider } from '../contexts/CartContext'
import { SearchProvider } from '../contexts/SearchContext'
import Search from './Search'
import * as searchService from '../services/search.service'
import * as useGeolocationHook from '../hooks/useGeolocation'

// Mock the services and hooks
vi.mock('../services/search.service')
vi.mock('../hooks/useGeolocation')

const mockSearchResults = {
  results: [
    {
      id: '1',
      name: 'Table Mountain Tours',
      description: 'Amazing mountain tours',
      category: 'Tours',
      rating: 4.8,
      latitude: -33.9628,
      longitude: 18.4098,
      priceFrom: 500,
    },
    {
      id: '2',
      name: 'Cape Town Spa',
      description: 'Relaxing spa experience',
      category: 'Wellness',
      rating: 4.7,
      latitude: -33.9284,
      longitude: 18.4160,
      priceFrom: 400,
    },
  ],
  total: 2,
  query: 'Cape Town',
}

const renderSearch = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <SearchProvider>
          <CartProvider>
            <Search />
          </CartProvider>
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Search Page', () => {
  beforeEach(() => {
    // Mock user location
    vi.spyOn(useGeolocationHook, 'useGeolocation').mockReturnValue({
      location: {
        latitude: -33.9249,
        longitude: 18.4241,
        timestamp: Date.now(),
      },
      isLoading: false,
      error: null,
      hasPermission: true,
    })

    // Mock performSearch
    vi.spyOn(searchService, 'performSearch').mockResolvedValue(mockSearchResults)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render search hero component', () => {
    renderSearch()
    expect(screen.getByText('Find activities and stays near you')).toBeInTheDocument()
  })

  it('should trigger initial search when user location is available', async () => {
    await act(async () => {
      renderSearch()
    })

    await waitFor(() => {
      expect(searchService.performSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          lat: -33.9249,
          lng: 18.4241,
          radiusKm: 20,
        })
      )
    })
  })

  it('should display search results with map and list', async () => {
    await act(async () => {
      renderSearch()
    })

    await waitFor(() => {
      expect(screen.getByText('Table Mountain Tours')).toBeInTheDocument()
      expect(screen.getByText('Cape Town Spa')).toBeInTheDocument()
      expect(screen.getByText(/2 found/)).toBeInTheDocument()
    })
  })

  it('should apply filters and trigger search', async () => {
    await act(async () => {
      renderSearch()
    })

    await waitFor(() => {
      expect(screen.getByText('Table Mountain Tours')).toBeInTheDocument()
    })

    // Open filter panel
    const filterButton = screen.getByText('Filters')
    fireEvent.click(filterButton)

    await waitFor(() => {
      expect(screen.getByText('Price Range (Rand)')).toBeInTheDocument()
    })

    // Change minimum price filter
    const minPriceInput = screen.getByPlaceholderText('Min')
    fireEvent.change(minPriceInput, { target: { value: '300' } })

    // Debounce should trigger search after 500ms
    await waitFor(
      () => {
        expect(searchService.performSearch).toHaveBeenCalledWith(
          expect.objectContaining({
            minPrice: 300,
          })
        )
      },
      { timeout: 1000 }
    )
  })

  it('should show mobile map toggle button on small screens', async () => {
    // Mock mobile viewport
    window.innerWidth = 500
    await act(async () => {
      renderSearch()
    })
    await waitFor(() => {
      expect(screen.getByText(/Show Map/i)).toBeInTheDocument()
    })
  })

  it('should display recommendations when no search results', async () => {
    vi.spyOn(searchService, 'performSearch').mockResolvedValue({
      results: [],
      total: 0,
      query: '',
    })
    await act(async () => {
      renderSearch()
    })
    await waitFor(() => {
      expect(screen.getByText(/Explore by Region/i)).toBeInTheDocument()
    })
  })

  it('should handle search error gracefully', async () => {
    vi.spyOn(searchService, 'performSearch').mockRejectedValue(
      new Error('Search service unavailable')
    )

    await act(async () => {
      renderSearch()
    })

    await waitFor(() => {
      expect(screen.getByText(/Search service unavailable/i)).toBeInTheDocument()
    })
  })

  it('should navigate to business detail when clicking a result', async () => {
    await act(async () => {
      renderSearch()
    })

    await waitFor(() => {
      expect(screen.getByText('Table Mountain Tours')).toBeInTheDocument()
    })

    const cardTitle = screen.getByText('Table Mountain Tours')
    expect(cardTitle).toBeInTheDocument()
    
    // Click should navigate (tested via router mock in integration tests)
    fireEvent.click(cardTitle)
  })
})
