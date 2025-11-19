import React, { useState } from 'react'

export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [q, setQ] = useState('')
  return (
    <div className="search-bar">
      <input aria-label="search-input" value={q} onChange={e => setQ(e.target.value)} placeholder="Search for lodges, activities, region..." />
      <button onClick={() => onSearch(q)}>Search</button>
    </div>
  )
}
