/**
 * FilterPanel Component
 * Advanced filters for price, distance, rating, activity types, and facilities
 */
import React, { useState, useRef, useEffect } from 'react'
import { SearchRequest } from '../types/search'

interface FilterPanelProps {
  filters: Partial<SearchRequest>
  onFiltersChange: (filters: Partial<SearchRequest>) => void
  hasUserLocation: boolean
}

const ACTIVITY_TYPES = [
  'Beach',
  'Hiking',
  'Family Friendly',
  'Nightlife',
  'Business Travel',
  'Safari',
  'Wine Tasting',
  'Water Sports',
  'Cultural',
  'Adventure',
]

const FACILITIES = [
  'Free WiFi',
  'Parking',
  'Breakfast Included',
  'Wheelchair Accessible',
  'Kids Friendly',
  'Pet Friendly',
  'Swimming Pool',
  'Restaurant',
  'Bar',
  'Spa',
]

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'distance', label: 'Distance' },
  { value: 'price_low', label: 'Lowest Price' },
  { value: 'price_high', label: 'Highest Price' },
  { value: 'rating', label: 'Highest Rating' },
  { value: 'most_reviewed', label: 'Most Reviewed' },
]

export default function FilterPanel({
  filters,
  onFiltersChange,
  hasUserLocation,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const filterPanelRef = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef<number>(0)

  // Handle click outside to close the filter panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isExpanded &&
        filterPanelRef.current &&
        !filterPanelRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      // Add a small delay to prevent immediate closing when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)

      return () => {
        clearTimeout(timeoutId)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isExpanded])

  // Handle scroll to collapse the filter panel
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Only collapse if scrolling down and panel is expanded
      if (isExpanded && currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsExpanded(false)
      }

      lastScrollY.current = currentScrollY
    }

    if (isExpanded) {
      window.addEventListener('scroll', handleScroll, { passive: true })

      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [isExpanded])

  const handlePriceChange = (min: number, max: number) => {
    onFiltersChange({ ...filters, minPrice: min || undefined, maxPrice: max || undefined })
  }

  const handleDistanceChange = (distance: number) => {
    onFiltersChange({ ...filters, radiusKm: distance })
  }

  const handleRatingChange = (rating: number) => {
    onFiltersChange({ ...filters, minRating: rating || undefined })
  }

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({ ...filters, sortBy: sortBy as SearchRequest['sortBy'] })
  }

  const toggleActivityType = (type: string) => {
    const currentTypes = filters.activityTypes || []
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type]
    onFiltersChange({ ...filters, activityTypes: newTypes.length > 0 ? newTypes : undefined })
  }

  const toggleFacility = (facility: string) => {
    const currentFacilities = filters.facilities || []
    const newFacilities = currentFacilities.includes(facility)
      ? currentFacilities.filter((f) => f !== facility)
      : [...currentFacilities, facility]
    onFiltersChange({
      ...filters,
      facilities: newFacilities.length > 0 ? newFacilities : undefined,
    })
  }

  const handleClearFilters = () => {
    onFiltersChange({
      sortBy: 'relevance',
    })
  }

  const activeFiltersCount =
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.radiusKm && filters.radiusKm < 50 ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.activityTypes?.length || 0) +
    (filters.facilities?.length || 0)

  return (
    <div className={`filter-panel ${isExpanded ? 'filter-panel-expanded' : ''}`} ref={filterPanelRef}>
      <div className="filter-bar">
        <div className="filter-bar-left">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="filter-toggle-btn"
          >
            <span className="filter-icon">⚙️</span>
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="filter-badge">{activeFiltersCount}</span>
            )}
          </button>

          {/* Sort dropdown on the bar */}
          <select
            value={filters.sortBy || 'relevance'}
            onChange={(e) => handleSortChange(e.target.value)}
            className="filter-sort-select"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                Sort: {option.label}
              </option>
            ))}
          </select>
        </div>

        {activeFiltersCount > 0 && (
          <button type="button" onClick={handleClearFilters} className="filter-clear-btn">
            Clear all filters
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="filter-panel-content">
          {/* Price Range */}
          <div className="filter-section">
            <h4>Price Range (Rand)</h4>
            <div className="filter-price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) =>
                  handlePriceChange(parseInt(e.target.value) || 0, filters.maxPrice || 0)
                }
                className="filter-input"
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) =>
                  handlePriceChange(filters.minPrice || 0, parseInt(e.target.value) || 0)
                }
                className="filter-input"
              />
            </div>
          </div>

          {/* Distance from current location */}
          {hasUserLocation && (
            <div className="filter-section">
              <h4>Distance: {filters.radiusKm || 20} km</h4>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={filters.radiusKm || 20}
                onChange={(e) => handleDistanceChange(parseInt(e.target.value))}
                className="filter-slider"
              />
              <div className="filter-slider-labels">
                <span>5 km</span>
                <span>50 km</span>
              </div>
            </div>
          )}

          {/* Minimum Rating */}
          <div className="filter-section">
            <h4>Minimum Rating</h4>
            <div className="filter-rating-buttons">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingChange(rating)}
                  className={`filter-rating-btn ${
                    filters.minRating === rating ? 'filter-rating-btn-active' : ''
                  }`}
                >
                  {rating}★
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleRatingChange(0)}
                className={`filter-rating-btn ${
                  !filters.minRating ? 'filter-rating-btn-active' : ''
                }`}
              >
                Any
              </button>
            </div>
          </div>

          {/* Activity Types */}
          <div className="filter-section">
            <h4>Activity Types</h4>
            <div className="filter-chips">
              {ACTIVITY_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleActivityType(type)}
                  className={`filter-chip ${
                    filters.activityTypes?.includes(type) ? 'filter-chip-active' : ''
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div className="filter-section">
            <h4>Facilities</h4>
            <div className="filter-chips">
              {FACILITIES.map((facility) => (
                <button
                  key={facility}
                  type="button"
                  onClick={() => toggleFacility(facility)}
                  className={`filter-chip ${
                    filters.facilities?.includes(facility) ? 'filter-chip-active' : ''
                  }`}
                >
                  {facility}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
