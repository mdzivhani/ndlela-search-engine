/**
 * EmptySearchState Component
 * Friendly message shown when no search has been performed
 */
import React from 'react'
import { Button } from '../ui/Button'

interface EmptySearchStateProps {
  onStartSearch?: () => void
  message?: string
  hasUserLocation?: boolean
}

export default function EmptySearchState({
  onStartSearch,
  message = 'Start your adventure',
  hasUserLocation = false,
}: EmptySearchStateProps) {
  return (
    <div className="empty-search-state">
      <div className="empty-search-content">
        <div className="empty-search-icon">🔍</div>
        <h2>{message}</h2>
        <p>
          {hasUserLocation
            ? 'Use the search bar above to find activities, accommodations, and experiences. You can search by location, category, or explore our featured regions.'
            : 'Enable location access to get personalized recommendations, or search for a specific destination.'}
        </p>
        {onStartSearch && (
          <Button onClick={onStartSearch} className="btn-primary">
            Start Exploring
          </Button>
        )}
      </div>
    </div>
  )
}
