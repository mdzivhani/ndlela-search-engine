import { SearchResponse, SearchRequest } from '../types/search'
import { getAuthHeader } from '../contexts/AuthContext'

const API_BASE_URL = '/api'

export async function performSearch(request: SearchRequest): Promise<SearchResponse> {
  const params = new URLSearchParams()
  if (request.q) params.set('q', request.q)
  if (request.limit) params.set('limit', request.limit.toString())
  if (request.offset) params.set('offset', request.offset.toString())

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
