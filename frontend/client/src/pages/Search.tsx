import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { performSearch } from '../services/search.service'
import { SearchResponse } from '../types/search'

export default function Search() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

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
          <div className="search-results">
            <h2>
              Results for "{results.query}" ({results.total} found)
            </h2>

            {results.results.length === 0 ? (
              <p className="no-results">No results found. Try a different search term.</p>
            ) : (
              <ul className="results-list">
                {results.results.map((result) => (
                  <li 
                    key={result.id} 
                    className="result-item"
                    onClick={() => navigate(`/business/${result.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="result-header">
                      <h3>{result.name}</h3>
                      <span className="result-rating">★ {result.rating.toFixed(1)}</span>
                    </div>
                    <p className="result-description">{result.description}</p>
                    <span className="result-category">{result.category}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {!results && !error && (
          <div className="search-placeholder">
            <p>Enter a search query to get started</p>
          </div>
        )}
      </main>
    </div>
  )
}
