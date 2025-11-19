import React, { useState } from 'react'
import SearchBar from '../components/SearchBar'
import SearchResults from '../components/SearchResults'
import { search } from '../services/searchClient'

export default function PublicSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const doSearch = async (q: string) => {
    setLoading(true)
    setQuery(q)
    try {
      const res = await search(q)
      setResults(res)
    } finally { setLoading(false) }
  }

  return (
    <div className="page">
      <SearchBar onSearch={doSearch} />
      {loading ? <div>Searching...</div> : <SearchResults items={results} />}
    </div>
  )
}
