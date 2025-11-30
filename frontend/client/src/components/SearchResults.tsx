import React from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

type Item = {
  id: string
  name: string
  region?: string
  category?: string
  priceFrom?: number
  rating?: number
  reviewCount?: number
}

export default function SearchResults({ items }: { items: Item[] }) {
  if (!items || items.length === 0) return <div>No results</div>
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
      {items.map(it => (
        <Card key={it.id} padding={12} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <strong style={{ fontSize: '1rem' }}>{it.name}</strong>
            {typeof it.priceFrom === 'number' && (
              <span style={{ color: 'var(--primary-color)', fontWeight: 700 }}>R{it.priceFrom.toLocaleString()}</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {it.category && <Badge>{it.category}</Badge>}
            {it.region && <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>📍 {it.region}</span>}
            {typeof it.rating === 'number' && typeof it.reviewCount === 'number' && (
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>⭐ {it.rating} ({it.reviewCount})</span>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant='primary' small onClick={() => window.location.assign(`/business/${it.id}`)}>View</Button>
          </div>
        </Card>
      ))}
      <style>{`
        @media (max-width: 1024px) {
          .app > div > div { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 640px) {
          .app > div > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
