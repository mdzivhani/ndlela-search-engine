/**
 * Filter Chips Component
 * Display active filters as removable chips above search results
 */
import React from 'react'
import { SearchRequest } from '../types/search'

interface FilterChipsProps {
  filters: Partial<SearchRequest>
  onRemoveFilter: (filterKey: keyof SearchRequest) => void
  onClearAll?: () => void
}

const FILTER_LABELS: Record<string, string> = {
  q: 'Location',
  category: 'Category',
  checkIn: 'Check-in',
  checkOut: 'Check-out',
  adults: 'Adults',
  children: 'Children',
  radiusKm: 'Radius',
  sortBy: 'Sort',
  minRating: 'Min Rating',
  priceMin: 'Min Price',
  priceMax: 'Max Price',
}

export default function FilterChips({ filters, onRemoveFilter, onClearAll }: FilterChipsProps) {
  // Filter out default/empty values
  const activeFilters = Object.entries(filters)
    .filter(([key, value]) => {
      if (!value && value !== 0) return false
      if (key === 'sortBy' && value === 'relevance') return false
      if (key === 'radiusKm' && value === 20) return false
      if (key === 'limit') return false
      return true
    })

  if (activeFilters.length === 0) {
    return null
  }

  return (
    <div className="filter-chips-container">
      <div className="filter-chips">
        {activeFilters.map(([key, value]) => (
          <div key={key} className="filter-chip">
            <span className="chip-label">
              {FILTER_LABELS[key] || key}:
            </span>
            <span className="chip-value">
              {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
            </span>
            <button
              className="chip-remove"
              onClick={() => onRemoveFilter(key as keyof SearchRequest)}
              aria-label={`Remove ${FILTER_LABELS[key] || key} filter`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      {onClearAll && (
        <button className="clear-all-filters" onClick={onClearAll}>
          Clear all
        </button>
      )}
    </div>
  )
}
