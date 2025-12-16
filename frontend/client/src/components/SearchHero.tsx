/**
 * SearchHero Component
 * Enhanced search bar with location, dates, guests, and category selection
 */
import React, { useState, useCallback, useEffect } from 'react'
import { SearchRequest } from '../types/search'
import { useSearch } from '../contexts/SearchContext'

interface SearchHeroProps {
  onSearch: (params: SearchRequest) => void
  isLoading?: boolean
  recentSearches?: Array<{ displayText: string; params: SearchRequest }>
}

const CATEGORIES = [
  'All',
  'Accommodation',
  'Restaurant',
  'Adventure',
  'Tour',
  'Event',
  'Attraction',
  'Wellness',
  'Food & Drink',
  'Activities',
  'Other',
]

const POPULAR_AREAS = [
  'Cape Town',
  'Johannesburg',
  'Durban',
  'Kruger National Park',
  'Garden Route',
  'Stellenbosch',
]

export default function SearchHero({ onSearch, isLoading, recentSearches = [] }: SearchHeroProps) {
  const { setSearchParams } = useSearch()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [category, setCategory] = useState('All')
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Initialize from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.has('q')) setQuery(params.get('q') || '')
    if (params.has('category')) setCategory(params.get('category') || 'All')
    if (params.has('checkIn')) setCheckIn(params.get('checkIn') || '')
    if (params.has('checkOut')) setCheckOut(params.get('checkOut') || '')
    if (params.has('adults')) setAdults(Number(params.get('adults')) || 2)
    if (params.has('children')) setChildren(Number(params.get('children')) || 0)
  }, [])

  // Focus main search input when header search icon is clicked
  useEffect(() => {
    const handler = () => {
      const el = document.getElementById('location') as HTMLInputElement | null
      el?.focus()
    }
    window.addEventListener('focus-main-search', handler as EventListener)
    return () => window.removeEventListener('focus-main-search', handler as EventListener)
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      const searchParams: SearchRequest = {
        q: query || location || undefined,
        category: category !== 'All' ? category : undefined,
        checkIn: checkIn || undefined,
        checkOut: checkOut || undefined,
        adults: adults,
        children: children,
      }

      // Store search parameters for cart quantity defaults
      setSearchParams({
        adults,
        children,
        checkIn: checkIn || undefined,
        checkOut: checkOut || undefined,
        location: location || undefined,
      })

      // Update URL with search parameters
      const urlParams = new URLSearchParams()
      if (searchParams.q) urlParams.set('q', searchParams.q)
      if (searchParams.category) urlParams.set('category', searchParams.category)
      if (searchParams.checkIn) urlParams.set('checkIn', searchParams.checkIn)
      if (searchParams.checkOut) urlParams.set('checkOut', searchParams.checkOut)
      if (searchParams.adults && searchParams.adults > 0) urlParams.set('adults', String(searchParams.adults))
      if (searchParams.children && searchParams.children > 0) urlParams.set('children', String(searchParams.children))
      
      window.history.pushState({}, '', `?${urlParams.toString()}`)

      onSearch(searchParams)
      setShowSuggestions(false)
    },
    [query, location, checkIn, checkOut, adults, children, category, onSearch, setSearchParams]
  )

  const handleQuickSearch = (area: string) => {
    setLocation(area)
    setShowSuggestions(false)
    onSearch({ q: area })
  }

  const handleRecentSearch = (params: SearchRequest) => {
    if (params.q) setQuery(params.q)
    if (params.category) setCategory(params.category)
    if (params.checkIn) setCheckIn(params.checkIn)
    if (params.checkOut) setCheckOut(params.checkOut)
    if (params.adults) setAdults(params.adults)
    if (params.children) setChildren(params.children)
    
    onSearch(params)
  }

  return (
    <div className="search-hero">
      <div className="search-hero-content">
        <h2 className="search-hero-title">Find activities and stays near you</h2>

        <form onSubmit={handleSubmit} className="search-hero-form">
          <div className="search-hero-grid">
            {/* Location Input */}
            <div className="search-field search-field-location">
              <label htmlFor="location">Where</label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="City, town, or destination"
                className="search-input"
                disabled={isLoading}
              />
            </div>

            {/* Check-in Date */}
            <div className="search-field">
              <label htmlFor="checkIn">Check-in</label>
              <input
                id="checkIn"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="search-input"
                disabled={isLoading}
              />
            </div>

            {/* Check-out Date */}
            <div className="search-field">
              <label htmlFor="checkOut">Check-out</label>
              <input
                id="checkOut"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="search-input"
                disabled={isLoading}
                min={checkIn}
              />
            </div>

            {/* Guests - Compact inline version */}
            <div className="search-field">
              <label>Guests</label>
              <div className="guests-selector-compact">
                <div className="guest-compact">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    disabled={isLoading || adults <= 1}
                    className="counter-btn"
                    aria-label="Decrease adults"
                  >
                    -
                  </button>
                  <span className="counter-label">{adults} {adults === 1 ? 'Adult' : 'Adults'}</span>
                  <button
                    type="button"
                    onClick={() => setAdults(adults + 1)}
                    disabled={isLoading}
                    className="counter-btn"
                    aria-label="Increase adults"
                  >
                    +
                  </button>
                </div>
                <div className="guest-compact">
                  <button
                    type="button"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    disabled={isLoading || children <= 0}
                    className="counter-btn"
                    aria-label="Decrease children"
                  >
                    -
                  </button>
                  <span className="counter-label">{children} {children === 1 ? 'Child' : 'Children'}</span>
                  <button
                    type="button"
                    onClick={() => setChildren(children + 1)}
                    disabled={isLoading}
                    className="counter-btn"
                    aria-label="Increase children"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="search-field">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="search-input"
                disabled={isLoading}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="search-field search-field-button">
              <label>&nbsp;</label>
              <button type="submit" disabled={isLoading} className="search-hero-btn">
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </form>

        {/* Popular Areas and Recent Searches */}
        {showSuggestions && (
          <div className="search-suggestions">
            <div className="suggestions-section">
              <h4>Popular areas</h4>
              <div className="suggestion-chips">
                {POPULAR_AREAS.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => handleQuickSearch(area)}
                    className="suggestion-chip"
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {recentSearches.length > 0 && (
              <div className="suggestions-section">
                <h4>Recent searches</h4>
                <div className="recent-searches">
                  {recentSearches.slice(0, 5).map((search, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleRecentSearch(search.params)}
                      className="recent-search-item"
                    >
                      <span className="recent-search-icon">🕐</span>
                      <span>{search.displayText}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
