import React from 'react'

type BadgeProps = {
  children: React.ReactNode
  tone?: 'neutral' | 'primary' | 'accent'
  style?: React.CSSProperties
}

export function Badge({ children, tone = 'neutral', style }: BadgeProps) {
  const bg = tone === 'primary' ? 'rgba(0,0,0,0.06)' : tone === 'accent' ? 'rgba(255, 122, 89, 0.12)' : 'var(--gray-100)'
  const color = tone === 'primary' ? 'var(--text-primary)' : tone === 'accent' ? 'var(--accent-color, #FF7A59)' : 'var(--gray-700)'
  return (
    <span
      style={{
        fontSize: '0.75rem',
        color,
        backgroundColor: bg,
        padding: '3px 8px',
        borderRadius: '999px',
        display: 'inline-block',
        ...style,
      }}
    >
      {children}
    </span>
  )
}
