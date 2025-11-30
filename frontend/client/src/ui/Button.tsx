import React from 'react'
import { theme } from './theme'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  small?: boolean
}

export function Button({ variant = 'primary', small = false, style, ...props }: ButtonProps) {
  const base: React.CSSProperties = {
    border: 'none',
    borderRadius: theme.borderRadius,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    padding: small ? '6px 10px' : '8px 14px',
    fontSize: small ? '0.8rem' : '0.9rem',
  }
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: theme.primaryColor, color: 'white' },
    secondary: { background: theme.secondaryColor, color: 'white' },
    ghost: { background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' },
  }
  return <button {...props} style={{ ...base, ...variants[variant], ...style }} />
}
