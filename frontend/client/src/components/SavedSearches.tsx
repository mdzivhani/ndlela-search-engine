/**
 * Saved Searches Component
 * Display recently saved searches for logged-in users
 */
import React from 'react'
import { useAuth } from '../contexts/AuthContext'

export interface SavedSearch {
  q?: string
  category?: string
  checkIn?: string
  checkOut?: string
  adults?: number
  children?: number
  timestamp: number
}

const STORAGE_KEY = 'ndlela_saved_searches'
const MAX_SAVED = 5

export function getSavedSearches(): SavedSearch[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored) as SavedSearch[]
    return parsed.slice(0, MAX_SAVED)
  } catch {
    return []
  }
}

export function saveSearch(search: Omit<SavedSearch, 'timestamp'>): void {
  try {
    const existing = getSavedSearches()
    const newSearch: SavedSearch = { ...search, timestamp: Date.now() }
    // Remove duplicate if exists
    const filtered = existing.filter(
      (s) => s.q !== search.q || s.category !== search.category
    )
    const updated = [newSearch, ...filtered].slice(0, MAX_SAVED)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // Silently fail if localStorage unavailable
  }
}

export function clearSavedSearches(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Silently fail
  }
}

interface SavedSearchesProps {
  onSelectSearch: (search: SavedSearch) => void
}

export default function SavedSearches({ onSelectSearch }: SavedSearchesProps) {
  const { user } = useAuth()
  const searches = getSavedSearches()

  if (!user || searches.length === 0) {
    return null
  }

  return (
    <div className="saved-searches">
      <h4 className="saved-searches-title">Recent searches</h4>
      <div className="saved-searches-list">
        {searches.map((search, idx) => {
          const displayText = search.q || search.category || 'Recent search'
          return (
            <button
              key={idx}
              className="saved-search-item"
              onClick={() => onSelectSearch(search)}
              title={displayText}
            >
              <span className="saved-search-icon">⏱️</span>
              <span className="saved-search-text">{displayText}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
