export interface Location {
  lat: number
  lng: number
  address: string
  city: string
  province: string
}

export interface SearchResult {
  id: string
  name: string
  description: string
  category: string
  rating: number
  location?: Location
  amenities?: string[]
  activities?: string[]
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
}

export interface SearchRequest {
  q: string
  limit?: number
  offset?: number
}
