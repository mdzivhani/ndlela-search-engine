import { SearchResponse, SearchRequest } from '../types/search'
import { getAuthHeader } from '../contexts/AuthContext'

const API_BASE_URL = '/api'

export async function performSearch(request: SearchRequest): Promise<SearchResponse> {
  const params = new URLSearchParams()
  
  // Text query
  if (request.q) params.set('q', request.q)
  
  // Pagination
  if (request.limit) params.set('limit', request.limit.toString())
  if (request.offset) params.set('offset', request.offset.toString())
  
  // Location-based search
  if (request.lat !== undefined) params.set('lat', request.lat.toString())
  if (request.lng !== undefined) params.set('lng', request.lng.toString())
  if (request.radiusKm) params.set('radiusKm', request.radiusKm.toString())
  
  // Map bounds search
  if (request.bounds) {
    params.set('north', request.bounds.north.toString())
    params.set('south', request.bounds.south.toString())
    params.set('east', request.bounds.east.toString())
    params.set('west', request.bounds.west.toString())
  }
  
  // Category filter
  if (request.category) params.set('category', request.category)
  
  // Price filters
  if (request.minPrice !== undefined) params.set('minPrice', request.minPrice.toString())
  if (request.maxPrice !== undefined) params.set('maxPrice', request.maxPrice.toString())
  
  // Rating filter
  if (request.minRating !== undefined) params.set('minRating', request.minRating.toString())
  
  // Date filters
  if (request.checkIn) params.set('checkIn', request.checkIn)
  if (request.checkOut) params.set('checkOut', request.checkOut)
  
  // Guest counts
  if (request.adults) params.set('adults', request.adults.toString())
  if (request.children) params.set('children', request.children.toString())
  
  // Activity types (multi-value)
  if (request.activityTypes && request.activityTypes.length > 0) {
    request.activityTypes.forEach(type => params.append('activityType', type))
  }
  
  // Facilities (multi-value)
  if (request.facilities && request.facilities.length > 0) {
    request.facilities.forEach(facility => params.append('facility', facility))
  }
  
  // Sort order
  if (request.sortBy) params.set('sortBy', request.sortBy)

  const response = await fetch(`${API_BASE_URL}/search?${params.toString()}`, {
    headers: getAuthHeader()
  })

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`)
  }

  return response.json()
}

export async function searchByCategory(
  category: string,
  limit: number = 10
): Promise<SearchResponse> {
  const params = new URLSearchParams()
  params.set('category', category)
  params.set('limit', limit.toString())

  const response = await fetch(`${API_BASE_URL}/search/category?${params.toString()}`, {
    headers: getAuthHeader()
  })

  if (!response.ok) {
    throw new Error(`Category search failed: ${response.statusText}`)
  }

  return response.json()
}
