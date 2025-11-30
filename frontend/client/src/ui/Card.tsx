import React from 'react'
import { theme } from './theme'

type CardProps = {
  children: React.ReactNode
  padding?: number
  style?: React.CSSProperties
  as?: keyof JSX.IntrinsicElements
}

export function Card({ children, padding = 12, style, as = 'div' }: CardProps) {
  const Component = as as any
  return (
    <Component
      style={{
        background: 'white',
        border: '1px solid var(--border-color)',
        borderRadius: theme.cardRadius,
        boxShadow: theme.cardShadow,
        padding,
        ...style,
      }}
    >
      {children}
    </Component>
  )
}
