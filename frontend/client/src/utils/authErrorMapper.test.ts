import { describe, it, expect } from 'vitest'
import { ApiClientError } from './apiClient'
import { mapAuthError } from './authErrorMapper'

describe('authErrorMapper', () => {
  it('maps user not found', () => {
    const err = new ApiClientError('missing', { code: 'AUTH_USER_NOT_FOUND', status: 404, details: { error: { field: 'email' } } })
    const mapped = mapAuthError(err)
    expect(mapped.email).toContain('not registered')
  })

  it('maps invalid credentials', () => {
    const err = new ApiClientError('bad', { code: 'AUTH_INVALID_CREDENTIALS', status: 401, details: { error: { field: 'password' } } })
    const mapped = mapAuthError(err)
    expect(mapped.password).toContain('Incorrect password')
  })

  it('maps weak password', () => {
    const err = new ApiClientError('weak', { code: 'AUTH_PASSWORD_WEAK', status: 400, details: { error: { field: 'password' } } })
    const mapped = mapAuthError(err)
    expect(mapped.password).toContain('Password')
  })

  it('handles service not found', () => {
    const err = new ApiClientError('Server error (404). Please try again later.', { status: 404 })
    const mapped = mapAuthError(err)
    expect(mapped.summary).toContain('service not found')
  })
})
