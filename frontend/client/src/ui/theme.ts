export const theme = {
  primaryColor: 'var(--primary-color)',
  secondaryColor: 'var(--secondary-color)',
  accentColor: 'var(--accent-color, #FF7A59)',
  neutralBackground: 'var(--background-secondary)',
  borderRadius: '8px',
  cardRadius: '10px',
  shadow: '0 2px 8px rgba(0,0,0,0.08)',
  cardShadow: '0 1px 3px rgba(0,0,0,0.06)',
  primaryFontFamily: 'var(--font-family, Inter, system-ui, sans-serif)',
  headingFontWeight: 600,
}

export type Theme = typeof theme;
