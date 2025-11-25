# Frontend Guide

Consolidated from: FRONTEND_IMPLEMENTATION.md, FRONTEND_SUMMARY.md, FILTER_PANEL_ENHANCEMENTS.md, parts of IMPLEMENTATION_GUIDE.md.

## Tech Stack
React 18, TypeScript strict, Vite, React Router v6, Vitest, Leaflet.

## Core Directories
| Path | Purpose |
|------|---------|
| `src/pages` | Route pages (Login, Register, Search, BusinessDetail, Profile) |
| `src/components` | Reusable UI (SearchHero, ActivityMap, FilterPanel, ProfileAvatar, Cart) |
| `src/contexts` | Global state (AuthContext, CartContext) |
| `src/services` | API abstractions & business logic |
| `src/types` | Domain & DTO TypeScript types |
| `src/hooks` | Custom hooks (useGeolocation) |
| `src/data` | Mock/seed data (extendedMockBusinesses) |

## Component Patterns
Stateless presentational components where possible. Keep business logic in hooks/services. Avoid prop drilling via context.

### SearchHero
Compact booking/search interface (location, dates, guests, category). Uses controlled inputs + debounced parent callbacks.

### ActivityMap
Leaflet map with user marker, activity markers, optional "Search this area" overlay button triggered on map move.

### FilterPanel
Sticky panel with multi-facet filters: price range, rating, category, distance when geolocation available. Enhancements consolidated:
| Enhancement | Description |
|-------------|-------------|
| Debounced updates | 500ms delay to avoid rapid network calls |
| Badge counts | Show active filter tally next to panel title |
| Mobile collapse | Collapsible section on <768px screens |

### Service Cards (Business Detail)
Compact layout: essential info visible (title, category, duration, price, quantity selector, add to cart). Responsive multi-column grid via `repeat(auto-fit, minmax(280px, 1fr))`.

### ProfileAvatar
Image upload (PNG/JPG ≤1MB) with client-side square crop (256px). Optimistic state via `updateUser` in AuthContext.

## Styling Strategy
Global CSS with CSS custom properties (colors, spacing). Component-level inline styles used sparingly; consolidation into classes planned. Mobile-first adjustments with media queries.

Color tokens (examples):
```
--primary-color: #0057b7;
--secondary-color: #28a745;
--background-secondary: #f9fafb;
```

## State Management
AuthContext: user, token, login/register/logout, updateUser (partial merge).
CartContext: addToCart, isInCart, remove operations.

## API Interaction Pattern
Service layer functions return typed data. Components handle loading/error UI. Always catch and surface human-readable error messages.

## Geolocation Hook
`useGeolocation`: Requests browser permission, returns `{ coords, error, loading }`. Numeric error codes aligned with tests.

## Testing Strategy (Frontend)
Tools: Vitest + jsdom.
Focus areas:
- Hooks (geolocation)
- Search page integration
- Component rendering (SearchHero, BusinessDetail service grid, ProfileAvatar)

Run:
```bash
npm run test
```

## Performance Practices
| Area | Practice |
|------|----------|
| Rendering | Avoid unnecessary re-renders via memoization |
| Network | Debounce filter/search requests |
| Map | Limit marker re-creation; reuse objects |
| Bundling | Code splitting for large future modules |

## Accessibility Notes
- Use `aria-label` for interactive icon-only buttons (e.g., quantity controls, avatar actions).
- Maintain sufficient contrast with primary/secondary colors.

## Future Enhancements
- Location autocomplete (Mapbox / Places API)
- Marker clustering for dense areas
- Favorites & saved searches
- Progressive image loading for avatars & business images

---
Last Updated: 2025-11-25