import { ApiClientError } from './apiClient'

export interface AuthErrorMapping {
  summary?: string
  email?: string
  password?: string
  confirmPassword?: string
  name?: string
}

export function mapAuthError(err: unknown): AuthErrorMapping {
  if (!(err instanceof ApiClientError)) {
    return { summary: err instanceof Error ? err.message : 'An unexpected error occurred' }
  }

  const code = err.code
  const message = err.message || 'Authentication failed.'
  const field = (err.details as any)?.error?.field || undefined

  const mapping: AuthErrorMapping = {}

  const assignField = (f: keyof AuthErrorMapping, msg: string) => {
    mapping[f] = msg
    if (!mapping.summary) mapping.summary = msg
  }

  switch (code) {
    case 'AUTH_USER_NOT_FOUND':
      assignField('email', 'This email is not registered. Please create an account.')
      break
    case 'AUTH_INVALID_CREDENTIALS':
      assignField('password', 'Incorrect password. Please try again.')
      break
    case 'AUTH_EMAIL_ALREADY_EXISTS':
      assignField('email', 'This email is already registered. Please log in instead.')
      break
    case 'AUTH_PASSWORD_WEAK':
      assignField('password', message || 'Password does not meet requirements.')
      break
    case 'AUTH_PASSWORD_MISMATCH':
      assignField('confirmPassword', 'Passwords do not match')
      break
    case 'AUTH_VALIDATION_ERROR':
      if (field === 'email') assignField('email', 'Please enter a valid email address')
      else if (field === 'password') assignField('password', 'Please enter your password')
      else if (field === 'name') assignField('name', 'Full name is required')
      else mapping.summary = message
      break
    case 'NETWORK_ERROR':
      mapping.summary = 'We could not reach the login service. Please try again.'
      break
    default:
      if (err.status === 404) {
        mapping.summary = 'Login service not found. Please try again later.'
      } else {
        mapping.summary = message || 'Authentication failed. Please try again.'
      }
  }

  return mapping
}
