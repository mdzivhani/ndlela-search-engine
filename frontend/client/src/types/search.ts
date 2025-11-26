export interface SearchResult {
  id: string
  name: string
  description: string
  category: string
  rating: number
  latitude?: number
  longitude?: number
  priceFrom?: number
  priceTo?: number
  facilities?: string[]
  imageUrl?: string
  thumbnailUrl?: string
  starRating?: number
  reviewCount?: number
  city?: string
  province?: string
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
}

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

export interface SearchRequest {
  q?: string
  limit?: number
  offset?: number
  // Location-based search
  lat?: number
  lng?: number
  radiusKm?: number
  bounds?: MapBounds
  // Filters
  category?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  activityTypes?: string[]
  facilities?: string[]
  sortBy?: 'relevance' | 'distance' | 'price_low' | 'price_high' | 'rating' | 'most_reviewed'
  // Dates
  checkIn?: string
  checkOut?: string
  // Guests
  adults?: number
  children?: number
}

export interface UserLocation {
  latitude: number
  longitude: number
  accuracy?: number
  timestamp: number
}
