/**
 * EmptySearchState Component
 * Friendly message shown when no search has been performed
 * Includes popular destinations, categories, and location CTA
 */
import React from 'react'
import { Button } from '../ui/Button'

interface EmptySearchStateProps {
  onQuickSearch?: (query: string) => void
  onUseMyLocation?: () => void
  hasUserLocation?: boolean
}

const POPULAR_DESTINATIONS = [
  'Cape Town',
  'Johannesburg',
  'Durban',
  'Kruger National Park',
  'Garden Route',
]

const CATEGORIES = ['Adventure', 'Accommodation', 'Food & Drink', 'Tours', 'Wellness']

export default function EmptySearchState({
  onQuickSearch,
  onUseMyLocation,
  hasUserLocation = false,
}: EmptySearchStateProps) {
  return (
    <div className="empty-search-state">
      <div className="empty-search-content">
        <div className="empty-search-icon">🔍</div>
        <h2>Start your adventure</h2>
        <p>
          Discover amazing activities, accommodations, and experiences across South Africa.
        </p>

        {/* Use My Location CTA */}
        {!hasUserLocation && onUseMyLocation && (
          <div className="empty-search-cta">
            <Button onClick={onUseMyLocation} className="btn-primary" style={{ marginBottom: '1.5rem' }}>
              📍 Use My Location
            </Button>
            <p style={{ fontSize: '0.875rem', color: '#666', margin: '0.5rem 0' }}>
              Enable location access for personalized recommendations
            </p>
          </div>
        )}

        {/* Popular Destinations */}
        <div className="empty-search-section">
          <h4>Popular Destinations</h4>
          <div className="empty-search-pills">
            {POPULAR_DESTINATIONS.map((dest) => (
              <button
                key={dest}
                className="search-pill"
                onClick={() => onQuickSearch?.(dest)}
              >
                {dest}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="empty-search-section">
          <h4>Browse by Category</h4>
          <div className="empty-search-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className="category-pill"
                onClick={() => onQuickSearch?.(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
