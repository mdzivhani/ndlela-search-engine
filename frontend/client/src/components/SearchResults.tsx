import React from 'react'

export default function SearchResults({ items }: { items: any[] }) {
  if (!items || items.length === 0) return <div>No results</div>
  return (
    <ul>
      {items.map(it => (
        <li key={it.id}>
          <strong>{it.name}</strong> — {it.region}
        </li>
      ))}
    </ul>
  )
}
