> This file has been deprecated.
# Implementation Guide (Moved)

The full implementation guidance has been consolidated into `docs/IMPLEMENTATION_GUIDE.md` and `docs/FRONTEND_GUIDE.md`.

Original detailed sections (map search, SearchHero, filters, recommendations, user flows) now reside in:
- `docs/FRONTEND_GUIDE.md` (frontend & component architecture)
- `docs/IMPLEMENTATION_GUIDE.md` (cross-cutting & architecture)

Please update references to point to the consolidated documents. This legacy file is retained only as a migration pointer.

Last Updated: 2025-11-25

## 🚀 Features

### Core Functionality
- **Interactive Map Search**: Real-time activity/business discovery with Leaflet maps
- **Geolocation Support**: Automatic location detection with fallback to South Africa default
- **Advanced Filters**: Price range, distance, rating, activity types, and facilities
- **Search This Area**: Dynamic map-bounds searching
- **Responsive Design**: Mobile-first with tablet and desktop layouts
- **Split View Layout**: Side-by-side list and map on desktop, toggle on mobile

### Search Hero
- Location autocomplete
- Date range picker (check-in/check-out)
- Guest selection (adults and children)
- Category dropdown
- Recent searches and popular areas

### Recommendations
- **For You**: Personalized activity suggestions
- **Top Picks Near You**: Highly-rated activities by proximity
- **Recently Viewed**: Continue where you left off
- **Explore by Region**: Quick navigation to major SA destinations

### Map Features
- User location marker ("You are here")
- Activity markers with hover interactions
- Info cards with ratings and pricing
- "Search this area" button on map movement
- Synchronized list-map highlighting

## 📋 Prerequisites

- **Node.js**: v20 or higher
- **npm**: v9 or higher
- **Docker** (optional, for backend services)

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd frontend/client
npm install
```

### 2. Environment Variables

Create a `.env` file in `frontend/client/`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### 3. Install Leaflet Types (already included in package.json)

```bash
npm install --save-dev @types/leaflet
```

## 🚦 Running the Application

### Development Mode

#### Start Backend Services (Docker)

```bash
cd ../..  # Project root
docker compose -f docker-compose.dev.yml up -d
```

This starts:
- PostgreSQL database
- Auth API
- Business API
- Express server (search endpoints)

#### Start Frontend

```bash
cd frontend/client
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Files
- `src/hooks/useGeolocation.test.ts` - Geolocation hook tests
- `src/pages/Search.test.tsx` - Integration tests for Search page

## 🗺️ Map Configuration

The application uses **OpenStreetMap** via Leaflet, which requires no API key. If you want to use a different tile provider:

### Option 1: Mapbox (Recommended for Production)

1. Sign up at https://www.mapbox.com/
2. Get your API access token
3. Update `src/components/ActivityMap.tsx`:

```typescript
<TileLayer
  url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
  attribution='© <a href="https://www.mapbox.com/">Mapbox</a>'
  accessToken="YOUR_MAPBOX_TOKEN"
  id="mapbox/streets-v11"
/>
```

### Option 2: Google Maps

1. Enable Maps JavaScript API in Google Cloud Console
2. Install Google Maps React wrapper:
```bash
npm install @react-google-maps/api
```
3. Replace ActivityMap implementation with Google Maps version

## 📁 Project Structure

```
frontend/client/src/
├── components/
│   ├── ActivityMap.tsx          # Interactive Leaflet map
│   ├── SearchHero.tsx           # Enhanced search bar
│   ├── FilterPanel.tsx          # Advanced filters
│   ├── RecommendationsSections.tsx  # Recommendations UI
│   ├── Cart.tsx                 # Shopping cart (existing)
│   └── ...
├── hooks/
│   └── useGeolocation.ts        # Browser geolocation hook
├── pages/
│   ├── Search.tsx               # Main dashboard/landing page
│   └── ...
├── services/
│   ├── search.service.ts        # Enhanced search API client
│   └── ...
├── types/
│   └── search.ts                # TypeScript definitions
├── contexts/
│   ├── AuthContext.tsx          # Authentication (existing)
│   └── CartContext.tsx          # Shopping cart state (existing)
└── styles.css                    # Global styles + new components
```

## 🎨 Component Architecture

### Search.tsx (Main Dashboard)
The logged-in landing page that orchestrates all components:
- Manages search state and filters
- Handles geolocation initialization
- Coordinates map-list synchronization
- Implements debounced filter searching

### ActivityMap.tsx
Reusable map component:
- Leaflet integration
- Marker management
- "Search this area" functionality
- User location display
- Hover/click event handling

### SearchHero.tsx
Booking.com-inspired search interface:
- Location, dates, guests, category
- Recent searches storage
- Popular areas quick access

### FilterPanel.tsx
Advanced filtering with sticky behavior:
- Price range
- Distance (when location available)
- Rating
- Activity types
- Facilities
- Sort options

### RecommendationsSections.tsx
Personalized content sections:
- For You recommendations
- Top picks by proximity
- Recently viewed items
- Explore by region cards

## 🔌 API Integration

### Backend Requirements

The frontend expects these API endpoints:

#### Search Endpoint
```
GET /api/search
```

**Query Parameters:**
- `q` - Text search query
- `lat`, `lng`, `radiusKm` - Location-based search
- `north`, `south`, `east`, `west` - Map bounds search
- `category` - Filter by category
- `minPrice`, `maxPrice` - Price range
- `minRating` - Minimum rating
- `checkIn`, `checkOut` - Date filters
- `adults`, `children` - Guest counts
- `activityType[]` - Activity type tags (multi-value)
- `facility[]` - Facilities (multi-value)
- `sortBy` - Sort order
- `limit`, `offset` - Pagination

**Response:**
```typescript
{
  results: SearchResult[],
  total: number,
  query: string
}
```

### Mock Data Support

For development without a complete backend, the application includes:
- `src/data/extendedMockBusinesses.ts` - 10 South African businesses with full details
- Backend can return this data structure for testing

## 🎯 User Flows

### 1. Initial Page Load
1. Request geolocation permission
2. If granted: Show nearby activities (20km radius)
3. If denied: Show SA default view with recommendations
4. Display search hero, filters, and region explorer

### 2. Search Flow
1. User enters location/dates/guests/category
2. Click "Search" button
3. Results update in list and map
4. Applied filters shown with badge count

### 3. Filter Flow
1. User adjusts filter (price, distance, rating, etc.)
2. 500ms debounce delay
3. Search triggered with new filters
4. List and map update simultaneously

### 4. Map Interaction Flow
1. User pans/zooms map
2. "Search this area" button appears
3. Click triggers bounded search
4. Results update to visible area

### 5. Region Exploration
1. User clicks region card (e.g., "Cape Town")
2. Map centers on region
3. Search triggered for that area
4. Results filtered to region

## 🧪 Testing Approach

### Unit Tests
- Geolocation hook with permission scenarios
- Filter state management
- Search parameter building

### Integration Tests
- Full Search page rendering
- Filter application triggering search
- Map-list synchronization
- Error handling

### Test Coverage Goals
- Hooks: >90%
- Components: >80%
- Services: >85%

## 🚧 Known Limitations & TODOs

### Current Limitations
1. **No Location Autocomplete**: Geocoding API integration needed
2. **No Marker Clustering**: Basic implementation, can add `react-leaflet-cluster`
3. **Mock Recommendations**: Placeholder logic for "For You" section
4. **No Real-time Updates**: WebSocket integration for live availability

### Future Enhancements
- [ ] Add Google Places autocomplete for location search
- [ ] Implement marker clustering for high-density areas
- [ ] Add route planning between activities
- [ ] Integrate real recommendation ML service
- [ ] Add user favorites and saved searches
- [ ] Implement activity booking flow
- [ ] Add reviews and ratings submission
- [ ] Multi-language support (Zulu, Afrikaans, etc.)

## 🐛 Troubleshooting

### Map Not Displaying
- Check Leaflet CSS is imported
- Verify container has defined height
- Check browser console for tile loading errors

### Geolocation Not Working
- Use HTTPS (required for geolocation API)
- Check browser permissions
- Test fallback to SA default location

### Search Not Returning Results
- Verify backend API is running
- Check API_BASE_URL in .env
- Inspect network tab for errors
- Verify authentication headers

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npx tsc --noEmit
```

## 📱 Mobile Responsiveness

### Breakpoints
- **Mobile**: < 768px (stacked layout, map toggle)
- **Tablet**: 768px - 1024px (partial split view)
- **Desktop**: > 1024px (full split view 40/60)

### Mobile-Specific Features
- Map toggle button (list/map switch)
- Collapsible filter panel
- Simplified guest selector
- Touch-optimized map controls

## 🔒 Security Considerations

1. **API Authentication**: All search requests include auth headers
2. **Input Sanitization**: Query parameters validated before API calls
3. **HTTPS Required**: Geolocation requires secure context
4. **Environment Variables**: Sensitive config in .env files

## 📊 Performance Optimization

### Implemented
- Debounced filter searches (500ms)
- Lazy loading of recommendations
- Memoized map center calculations
- CSS-based skeleton loaders

### Future Optimizations
- Virtual scrolling for large result lists
- Progressive image loading
- Service worker for offline support
- CDN for tile caching

## 🤝 Contributing

1. Follow existing code structure and naming conventions
2. Add tests for new features
3. Update this README for significant changes
4. Run linter before committing: `npm run lint`
5. Ensure all tests pass: `npm test`

## 📄 License

This project is part of the Ndlela Search Engine platform for South African tourism SMMEs.

## 👥 Support

For issues or questions:
- Check existing GitHub issues
- Review troubleshooting section above
- Contact development team

---

**Built with ❤️ for South African tourism and SMMEs**
