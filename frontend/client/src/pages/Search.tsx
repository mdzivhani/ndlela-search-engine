import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { performSearch } from '../services/search.service'
import { SearchResponse, SearchRequest, MapBounds } from '../types/search'
import { useGeolocation } from '../hooks/useGeolocation'
import Cart from '../components/Cart'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import SearchHero from '../components/SearchHero'
import FilterPanel from '../components/FilterPanel'
import ActivityMap from '../components/ActivityMap'
import RecommendationsSections from '../components/RecommendationsSections'

export default function Search() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { location: userLocation, isLoading: isLocationLoading } = useGeolocation()
  
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showMap, setShowMap] = useState(false) // For mobile map toggle
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>()
  const [mapZoom, setMapZoom] = useState<number>(10)
  
  // Search filters state
  const [filters, setFilters] = useState<Partial<SearchRequest>>({
    sortBy: 'relevance',
    radiusKm: 20,
  })

  const handleSearch = useCallback(
    async (params: SearchRequest) => {
      setError('')
      setIsLoading(true)
      
      try {
        // Merge with current filters and user location
        const searchParams: SearchRequest = {
          ...filters,
          ...params,
          limit: params.limit || 20,
        }

        // If we have user location and no specific location in params, use it
        if (userLocation && !params.lat && !params.lng && !params.bounds) {
          searchParams.lat = userLocation.latitude
          searchParams.lng = userLocation.longitude
        }

        const response = await performSearch(searchParams)
        setResults(response)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
        setResults(null)
      } finally {
        setIsLoading(false)
      }
    },
    [filters, userLocation]
  )

  // Perform initial search when user location is available
  useEffect(() => {
    if (userLocation && !isLocationLoading && !results) {
      const initialSearch: SearchRequest = {
        lat: userLocation.latitude,
        lng: userLocation.longitude,
        radiusKm: 20,
        limit: 20,
      }
      handleSearch(initialSearch)
    }
  }, [userLocation, isLocationLoading, handleSearch])

  const handleFiltersChange = useCallback((newFilters: Partial<SearchRequest>) => {
    setFilters(newFilters)
    // Debounced search will be triggered by useEffect below
  }, [])

  // Debounced search on filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Object.keys(filters).length > 1) { // More than just sortBy
        handleSearch(filters)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [filters])

  const handleMapBoundsChange = useCallback((bounds: MapBounds) => {
    handleSearch({ bounds })
  }, [handleSearch])

  const handleRegionClick = (region: string, lat: number, lng: number) => {
    setMapCenter([lat, lng])
    setMapZoom(10)
    handleSearch({ lat, lng, radiusKm: 30 })
  }

  const handleMarkerClick = (id: string) => {
    navigate(`/business/${id}`)
  }

  const handleActivityCardHover = (id: string | null) => {
    setHighlightedId(id)
  }

  return (
    <div className="search-container">
      <header className="search-header">
        <div className="header-content">
          <h1>Ndlela Search</h1>
        </div>
      </header>

      <main className="search-main">
        {/* Hero Search Section */}
        <SearchHero
          onSearch={handleSearch}
          isLoading={isLoading}
          recentSearches={[]}
        />

        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          hasUserLocation={!!userLocation}
        />

        {error && <div className="error-message">{error}</div>}

        {/* Show recommendations when no search results or empty results */}
        {(!results || results.results.length === 0) && !error && !isLoading && (
          <RecommendationsSections
            forYou={[]}
            topPicks={[]}
            recentlyViewed={[]}
            onActivityClick={(id) => navigate(`/business/${id}`)}
            onRegionClick={handleRegionClick}
          />
        )}

        {/* Results Section with Map and List */}
        {results && (
          <div className="results-section">
            <div className="results-header">
              <h2>
                {results.query && `Results for "${results.query}"`} ({results.total} found)
              </h2>
              
              {/* Mobile map toggle */}
              <button
                className="mobile-map-toggle"
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? '📋 Show List' : '🗺️ Show Map'}
              </button>
            </div>

            <div className={`results-layout ${showMap ? 'show-map' : 'show-list'}`}>
              {/* Results List */}
              <div className="results-list-container">
                {results.results.length === 0 ? (
                  <div className="no-results">
                    <p>No results found. Try adjusting your filters or search area.</p>
                  </div>
                ) : (
                  <div className="results-list-modern">
                    {results.results.map((result) => (
                      <div
                        key={result.id}
                        className={`result-item-modern ${highlightedId === result.id ? 'highlighted' : ''}`}
                        onClick={() => navigate(`/business/${result.id}`)}
                        onMouseEnter={() => handleActivityCardHover(result.id)}
                        onMouseLeave={() => handleActivityCardHover(null)}
                      >
                        <div className="result-header-modern">
                          <div className="result-title-section">
                            <h3 className="result-title">{result.name}</h3>
                            <div className="result-meta">
                              <span className="result-rating">
                                <span className="star-icon">★</span>
                                {result.rating.toFixed(1)}
                              </span>
                              <span className="result-separator">•</span>
                              <Badge>{result.category}</Badge>
                              {(result.city || result.province) && (
                                <>
                                  <span className="result-separator">•</span>
                                  <span className="result-location">
                                    📍 {[result.city, result.province].filter(Boolean).join(', ')}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          {result.priceFrom && (
                            <div className="result-price-modern">
                              <span className="price-label">From</span>
                              <span className="price-value">R{result.priceFrom.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                        <p className="result-description">{result.description}</p>
                        <div className="result-footer-modern">
                          <Button variant='primary' small onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/business/${result.id}`)
                          }}>View Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Map View */}
              <div className="results-map-container">
                <ActivityMap
                  activities={results.results}
                  userLocation={userLocation}
                  highlightedId={highlightedId}
                  onMarkerClick={handleMarkerClick}
                  onMarkerHover={handleActivityCardHover}
                  onBoundsChange={handleMapBoundsChange}
                  center={mapCenter}
                  zoom={mapZoom}
                />
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="loading-state">
            <p>Searching for amazing experiences...</p>
          </div>
        )}
      </main>

      <Cart />
    </div>
  )
}
