export interface SearchResult {
  id: string
  name: string
  description: string
  category: string
  rating: number
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
