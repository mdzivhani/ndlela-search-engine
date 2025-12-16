/**
 * Tests for API client error handling
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ApiClientError, apiClient } from './apiClient'

// Mock fetch globally
global.fetch = vi.fn()

describe('API Client Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('ApiClientError', () => {
    it('should create error with message', () => {
      const error = new ApiClientError('Test error')
      expect(error.message).toBe('Test error')
      expect(error.name).toBe('ApiClientError')
    })

    it('should store error code', () => {
      const error = new ApiClientError('Test error', { code: 'TEST_CODE' })
      expect(error.code).toBe('TEST_CODE')
    })

    it('should store HTTP status', () => {
      const error = new ApiClientError('Test error', { status: 404 })
      expect(error.status).toBe(404)
    })

    it('should store error details', () => {
      const details = { field: 'email', reason: 'already exists' }
      const error = new ApiClientError('Test error', { details })
      expect(error.details).toEqual(details)
    })
  })

  describe('Non-JSON Response Handling', () => {
    it('should handle HTML error pages gracefully', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: new Map([['content-type', 'text/html']]),
        text: async () => '<html><body>Internal Server Error</body></html>',
      })

      try {
        await apiClient.post('/auth/login', { email: 'test@example.com', password: 'pass' }, { skipAuth: true })
        expect.fail('Should have thrown error')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiClientError)
        expect((error as ApiClientError).status).toBe(500)
        expect((error as ApiClientError).message).toContain('Server error')
      }
    })

    it('should handle successful JSON response', async () => {
      const mockResponse = { token: 'abc123', user: { id: 1, email: 'test@example.com' } }
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => mockResponse,
      })

      const result = await apiClient.post('/auth/login', { email: 'test@example.com', password: 'pass' }, { skipAuth: true })
      expect(result).toEqual(mockResponse)
    })

    it('should parse JSON error response with code', async () => {
      const mockError = { message: 'Invalid credentials', code: 'WRONG_PASSWORD' }
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => mockError,
      })

      try {
        await apiClient.post('/auth/login', { email: 'test@example.com', password: 'wrong' }, { skipAuth: true })
        expect.fail('Should have thrown error')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiClientError)
        expect((error as ApiClientError).code).toBe('WRONG_PASSWORD')
        expect((error as ApiClientError).status).toBe(401)
      }
    })

    it('should handle network errors', async () => {
      ;(global.fetch as any).mockRejectedValueOnce(new TypeError('Failed to fetch'))

      try {
        await apiClient.get('/search')
        expect.fail('Should have thrown error')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiClientError)
        expect((error as ApiClientError).code).toBe('NETWORK_ERROR')
      }
    })
  })

  describe('Auth Token Handling', () => {
    it('should include auth token in request headers', async () => {
      const token = 'test-token-123'
      localStorage.setItem('auth_token', token)

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ success: true }),
      })

      await apiClient.get('/users/me')

      const callArgs = (global.fetch as any).mock.calls[0]
      expect(callArgs[1].headers.Authorization).toBe(`Bearer ${token}`)
    })

    it('should skip auth when skipAuth is true', async () => {
      const token = 'test-token-123'
      localStorage.setItem('auth_token', token)

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ token, user: { id: 1 } }),
      })

      await apiClient.post('/auth/login', { email: 'test@example.com', password: 'pass' }, { skipAuth: true })

      const callArgs = (global.fetch as any).mock.calls[0]
      expect(callArgs[1].headers.Authorization).toBeUndefined()
    })
  })
})
