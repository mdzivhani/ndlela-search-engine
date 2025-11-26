/**
 * SearchHero Component Tests
 * Tests for compact layout rendering and search functionality
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SearchHero from './SearchHero'
import { SearchRequest } from '../types/search'

describe('SearchHero - Compact Layout', () => {
  const mockOnSearch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders in compact layout with all form fields', () => {
    render(<SearchHero onSearch={mockOnSearch} isLoading={false} />)

    expect(screen.getByText('Find activities and stays near you')).toBeInTheDocument()
    expect(screen.getByLabelText('Where')).toBeInTheDocument()
    expect(screen.getByLabelText('Check-in')).toBeInTheDocument()
    expect(screen.getByLabelText('Check-out')).toBeInTheDocument()
    expect(screen.getByText('Guests')).toBeInTheDocument()
    expect(screen.getByLabelText('Category')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
  })

  it('renders compact guests selector with adult and child counters', () => {
    render(<SearchHero onSearch={mockOnSearch} isLoading={false} />)

    expect(screen.getByText('2 Adults')).toBeInTheDocument()
    expect(screen.getByText('0 Children')).toBeInTheDocument()
  })

  it('updates adult count when +/- buttons are clicked', () => {
    render(<SearchHero onSearch={mockOnSearch} isLoading={false} />)

    const increaseBtn = screen.getAllByLabelText('Increase adults')[0]
    const decreaseBtn = screen.getAllByLabelText('Decrease adults')[0]

    fireEvent.click(increaseBtn)
    expect(screen.getByText('3 Adults')).toBeInTheDocument()

    fireEvent.click(decreaseBtn)
    expect(screen.getByText('2 Adults')).toBeInTheDocument()
  })

  it('updates children count when +/- buttons are clicked', () => {
    render(<SearchHero onSearch={mockOnSearch} isLoading={false} />)

    const increaseBtn = screen.getAllByLabelText('Increase children')[0]
    fireEvent.click(increaseBtn)
    expect(screen.getByText('1 Child')).toBeInTheDocument()

    fireEvent.click(increaseBtn)
    expect(screen.getByText('2 Children')).toBeInTheDocument()
  })

  it('prevents adults from going below 1', () => {
    render(<SearchHero onSearch={mockOnSearch} isLoading={false} />)

    const decreaseBtn = screen.getAllByLabelText('Decrease adults')[0]
    fireEvent.click(decreaseBtn)
    fireEvent.click(decreaseBtn)
    expect(screen.getByText('1 Adult')).toBeInTheDocument()
  })

  it('prevents children from going below 0', () => {
    render(<SearchHero onSearch={mockOnSearch} isLoading={false} />)

    const decreaseBtn = screen.getAllByLabelText('Decrease children')[0]
    expect(decreaseBtn).toBeDisabled()
  })

  it('submits search with all fields populated', async () => {
    render(<SearchHero onSearch={mockOnSearch} isLoading={false} />)

    const locationInput = screen.getByLabelText('Where')
    const checkInInput = screen.getByLabelText('Check-in')
    const checkOutInput = screen.getByLabelText('Check-out')
    const categorySelect = screen.getByLabelText('Category')
    const searchButton = screen.getByRole('button', { name: 'Search' })

    fireEvent.change(locationInput, { target: { value: 'Cape Town' } })
    fireEvent.change(checkInInput, { target: { value: '2025-12-01' } })
    fireEvent.change(checkOutInput, { target: { value: '2025-12-05' } })
    fireEvent.change(categorySelect, { target: { value: 'Accommodation' } })

    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          q: 'Cape Town',
          checkIn: '2025-12-01',
          checkOut: '2025-12-05',
          category: 'Accommodation',
          adults: 2,
          children: 0,
        })
      )
    })
  })

  it('submits search with only location when other fields are empty', async () => {
    render(<SearchHero onSearch={mockOnSearch} isLoading={false} />)

    const locationInput = screen.getByLabelText('Where')
    const searchButton = screen.getByRole('button', { name: 'Search' })

    fireEvent.change(locationInput, { target: { value: 'Durban' } })
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          q: 'Durban',
          adults: 2,
          children: 0,
        })
      )
    })
  })

  it('excludes "All" category from search params', async () => {
    render(<SearchHero onSearch={mockOnSearch} isLoading={false} />)

    const categorySelect = screen.getByLabelText('Category')
    const searchButton = screen.getByRole('button', { name: 'Search' })

    fireEvent.change(categorySelect, { target: { value: 'All' } })
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith(
        expect.not.objectContaining({
          category: 'All',
        })
      )
    })
  })

  it('disables all inputs when isLoading is true', () => {
    render(<SearchHero onSearch={mockOnSearch} isLoading={true} />)

    expect(screen.getByLabelText('Where')).toBeDisabled()
    expect(screen.getByLabelText('Check-in')).toBeDisabled()
    expect(screen.getByLabelText('Check-out')).toBeDisabled()
    expect(screen.getByLabelText('Category')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Searching...' })).toBeDisabled()
  })

  it('shows suggestions when location input is focused', async () => {
    render(<SearchHero onSearch={mockOnSearch} isLoading={false} />)

    const locationInput = screen.getByLabelText('Where')
    fireEvent.focus(locationInput)

    await waitFor(() => {
      expect(screen.getByText('Popular areas')).toBeInTheDocument()
      expect(screen.getByText('Cape Town')).toBeInTheDocument()
      expect(screen.getByText('Johannesburg')).toBeInTheDocument()
    })
  })

  it('hides suggestions after quick search', async () => {
    render(<SearchHero onSearch={mockOnSearch} isLoading={false} />)

    const locationInput = screen.getByLabelText('Where')
    fireEvent.focus(locationInput)

    await waitFor(() => {
      expect(screen.getByText('Cape Town')).toBeInTheDocument()
    })

    const capeTownBtn = screen.getByText('Cape Town')
    fireEvent.click(capeTownBtn)

    await waitFor(() => {
      expect(screen.queryByText('Popular areas')).not.toBeInTheDocument()
    })
  })

  it('displays recent searches when provided', () => {
    const recentSearches = [
      {
        displayText: 'Cape Town - 2 guests',
        params: { q: 'Cape Town', adults: 2 } as SearchRequest,
      },
    ]

    render(
      <SearchHero
        onSearch={mockOnSearch}
        isLoading={false}
        recentSearches={recentSearches}
      />
    )

    const locationInput = screen.getByLabelText('Where')
    fireEvent.focus(locationInput)

    expect(screen.getByText('Recent searches')).toBeInTheDocument()
    expect(screen.getByText('Cape Town - 2 guests')).toBeInTheDocument()
  })

  it('applies recent search parameters when clicked', async () => {
    const recentSearchParams: SearchRequest = {
      q: 'Kruger National Park',
      category: 'Adventure',
      checkIn: '2025-11-01',
      checkOut: '2025-11-05',
      adults: 4,
      children: 2,
    }

    const recentSearches = [
      {
        displayText: 'Kruger Adventure',
        params: recentSearchParams,
      },
    ]

    render(
      <SearchHero
        onSearch={mockOnSearch}
        isLoading={false}
        recentSearches={recentSearches}
      />
    )

    const locationInput = screen.getByLabelText('Where')
    fireEvent.focus(locationInput)

    const recentSearchBtn = screen.getByText('Kruger Adventure')
    fireEvent.click(recentSearchBtn)

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith(recentSearchParams)
    })

    expect(screen.getByLabelText('Category')).toHaveValue('Adventure')
    expect(screen.getByText('4 Adults')).toBeInTheDocument()
    expect(screen.getByText('2 Children')).toBeInTheDocument()
  })

  it('enforces minimum check-out date based on check-in', () => {
    render(<SearchHero onSearch={mockOnSearch} isLoading={false} />)

    const checkInInput = screen.getByLabelText('Check-in')
    const checkOutInput = screen.getByLabelText('Check-out')

    fireEvent.change(checkInInput, { target: { value: '2025-12-01' } })

    expect(checkOutInput).toHaveAttribute('min', '2025-12-01')
  })
})
