import React, { useState, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { performSearch } from '../services/search.service'
import { SearchResponse, SearchResult } from '../types/search'
import MapView from '../components/MapView'
import BusinessDetails from '../components/BusinessDetails'

export default function Search() {
  const { user, logout } = useAuth()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [selectedBusiness, setSelectedBusiness] = useState<SearchResult | null>(null)

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError('')

      if (!query.trim()) {
        setError('Please enter a search query')
        return
      }

      setIsLoading(true)
      try {
        const response = await performSearch({ q: query, limit: 20 })
        setResults(response)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
        setResults(null)
      } finally {
        setIsLoading(false)
      }
    },
    [query]
  )

  return (
    <div className="search-container">
      <header className="search-header">
        <div className="header-content">
          <h1>Ndlela Search</h1>
          <div className="user-info">
            <span>{user?.name}</span>
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="search-main">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for businesses, services, or locations..."
              className="search-input"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading} className="btn-search">
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && <div className="error-message">{error}</div>}

        {results && (
          <>
            <div className="view-toggle">
              <button
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                📋 List View
              </button>
              <button
                className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
                onClick={() => setViewMode('map')}
              >
                🗺️ Map View
              </button>
            </div>

            <div className="search-results">
              <h2>
                Results for "{results.query}" ({results.total} found)
              </h2>

              {results.results.length === 0 ? (
                <p className="no-results">No results found. Try a different search term.</p>
              ) : viewMode === 'map' ? (
                <MapView
                  results={results.results}
                  selectedResult={selectedBusiness}
                  onMarkerClick={setSelectedBusiness}
                />
              ) : (
                <ul className="results-list">
                  {results.results.map((result) => (
                    <li
                      key={result.id}
                      className="result-item clickable-result"
                      onClick={() => setSelectedBusiness(result)}
                    >
                      <div className="result-header">
                        <h3>{result.name}</h3>
                        <span className="result-rating">★ {result.rating.toFixed(1)}</span>
                      </div>
                      <p className="result-description">{result.description}</p>
                      <div className="result-footer">
                        <span className="result-category">{result.category}</span>
                        {result.location && (
                          <span className="result-location">
                            📍 {result.location.city}, {result.location.province}
                          </span>
                        )}
                      </div>
                      {result.amenities && result.amenities.length > 0 && (
                        <div className="result-tags">
                          {result.amenities.slice(0, 3).map((amenity, idx) => (
                            <span key={idx} className="mini-tag">{amenity}</span>
                          ))}
                          {result.amenities.length > 3 && (
                            <span className="mini-tag">+{result.amenities.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {!results && !error && (
          <div className="search-placeholder">
            <p>Enter a search query to get started</p>
          </div>
        )}
      </main>

      {selectedBusiness && (
        <BusinessDetails
          result={selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
        />
      )}
    </div>
  )
}
