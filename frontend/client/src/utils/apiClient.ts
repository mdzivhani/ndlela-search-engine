/**
 * Robust API client with proper error handling
 * Prevents "Unexpected token '<'" errors by handling non-JSON responses
 */

export interface ApiError {
  message: string
  code?: string
  status?: number
  details?: unknown
}

export class ApiClientError extends Error {
  public code?: string
  public status?: number
  public details?: unknown

  constructor(message: string, options?: { code?: string; status?: number; details?: unknown }) {
    super(message)
    this.name = 'ApiClientError'
    this.code = options?.code
    this.status = options?.status
    this.details = options?.details
  }
}

interface FetchOptions extends RequestInit {
  skipAuth?: boolean
}

const API_BASE_URL = '/api'
const TOKEN_KEY = 'auth_token'

/**
 * Robust fetch wrapper that handles non-JSON responses gracefully
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options
  
  // Build headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  }

  // Add auth token if not skipped
  if (!skipAuth) {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    })

    // Check content type before parsing
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')

    // Handle non-2xx responses
    if (!response.ok) {
      if (isJson) {
        const error = await response.json()
        throw new ApiClientError(
          error.message || `Request failed with status ${response.status}`,
          {
            code: error.code,
            status: response.status,
            details: error,
          }
        )
      } else {
        // Non-JSON error (HTML error page, proxy error, etc.)
        const text = await response.text()
        if (import.meta.env.DEV) {
          console.error('Non-JSON error response:', text.substring(0, 200))
        }
        throw new ApiClientError(
          `Server error (${response.status}). Please try again later.`,
          {
            status: response.status,
            details: text.substring(0, 200),
          }
        )
      }
    }

    // Handle successful response
    if (isJson) {
      return await response.json()
    } else {
      // Success but not JSON (shouldn't happen for our API)
      return await response.text() as T
    }
  } catch (error) {
    // Handle network errors or parsing errors
    if (error instanceof ApiClientError) {
      throw error
    }

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new ApiClientError(
        'Network error. Please check your connection and try again.',
        { code: 'NETWORK_ERROR' }
      )
    }

    throw new ApiClientError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      { details: error }
    )
  }
}

/**
 * Helper functions for common HTTP methods
 */
export const apiClient = {
  get: <T = unknown>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = unknown>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = unknown>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = unknown>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = unknown>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
}
