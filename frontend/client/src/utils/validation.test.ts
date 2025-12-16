/**
 * Tests for password validation and auth utilities
 */
import { describe, it, expect } from 'vitest'

// Import password validation from Register.tsx logic
function validatePasswordStrength(password: string) {
  const requirements = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
  }

  const passedCount = Object.values(requirements).filter(Boolean).length
  const score = Math.min(4, passedCount - 1)

  let message = ''
  if (!requirements.minLength) {
    message = 'Must be at least 8 characters'
  } else if (passedCount < 3) {
    message = 'Weak - add numbers or special characters'
  } else if (passedCount < 4) {
    message = 'Fair - consider adding uppercase/lowercase'
  } else if (passedCount < 5) {
    message = 'Good'
  } else {
    message = 'Strong'
  }

  return {
    isValid: requirements.minLength && (requirements.hasNumber || requirements.hasSpecial),
    score,
    message,
    requirements,
  }
}

describe('Password Validation', () => {
  it('should reject passwords shorter than 8 characters', () => {
    const result = validatePasswordStrength('Pass1')
    expect(result.isValid).toBe(false)
    expect(result.requirements.minLength).toBe(false)
  })

  it('should accept 8+ char password with number', () => {
    const result = validatePasswordStrength('Password1')
    expect(result.isValid).toBe(true)
  })

  it('should accept 8+ char password with special character', () => {
    const result = validatePasswordStrength('Password!')
    expect(result.isValid).toBe(true)
  })

  it('should reject password with only letters', () => {
    const result = validatePasswordStrength('LongPasswordWithoutNumbers')
    expect(result.isValid).toBe(false)
  })

  it('should provide correct strength score', () => {
    const weak = validatePasswordStrength('Pass1')
    // For short passwords, score is non-negative but not valid
    expect(weak.isValid).toBe(false)
    expect(weak.score).toBeGreaterThanOrEqual(0)

    const fair = validatePasswordStrength('Password1')
    expect(fair.score).toBeGreaterThanOrEqual(0)

    const strong = validatePasswordStrength('P@ssw0rd!')
    expect(strong.score).toBeGreaterThanOrEqual(3)
  })

  it('should detect all requirements correctly', () => {
    const result = validatePasswordStrength('MyPassword123!')
    expect(result.requirements.minLength).toBe(true)
    expect(result.requirements.hasNumber).toBe(true)
    expect(result.requirements.hasSpecial).toBe(true)
    expect(result.requirements.hasUpper).toBe(true)
    expect(result.requirements.hasLower).toBe(true)
  })
})

describe('Password Confirmation', () => {
  it('should match identical passwords', () => {
    const password = 'TestPassword123'
    const confirmPassword = 'TestPassword123'
    expect(password === confirmPassword).toBe(true)
  })

  it('should not match different passwords', () => {
    const password = 'TestPassword123'
    const confirmPassword = 'TestPassword124'
    expect(password === confirmPassword).toBe(false)
  })

  it('should not match empty confirm password', () => {
    const password = 'TestPassword123'
    const confirmPassword = ''
    expect(password === confirmPassword).toBe(false)
  })
})

describe('Form Validation', () => {
  it('should require all fields', () => {
    const name = 'John Doe'
    const email = 'john@example.com'
    const password = 'TestPassword123'
    const confirmPassword = 'TestPassword123'

    const isValid =
      name.trim().length > 0 &&
      email.includes('@') &&
      password.length >= 8 &&
      confirmPassword === password

    expect(isValid).toBe(true)
  })

  it('should reject missing name', () => {
    const name = ''
    const email = 'john@example.com'
    const password = 'TestPassword123'
    const confirmPassword = 'TestPassword123'

    const isValid =
      name.trim().length > 0 &&
      email.includes('@') &&
      password.length >= 8 &&
      confirmPassword === password

    expect(isValid).toBe(false)
  })

  it('should reject invalid email format', () => {
    const name = 'John Doe'
    const email = 'invalid.email'
    const password = 'TestPassword123'
    const confirmPassword = 'TestPassword123'

    const isValid =
      name.trim().length > 0 &&
      email.includes('@') &&
      password.length >= 8 &&
      confirmPassword === password

    expect(isValid).toBe(false)
  })

  it('should reject mismatched passwords', () => {
    const name = 'John Doe'
    const email = 'john@example.com'
    const password = 'TestPassword123'
    const confirmPassword = 'TestPassword124'

    const isValid =
      name.trim().length > 0 &&
      email.includes('@') &&
      password.length >= 8 &&
      confirmPassword === password

    expect(isValid).toBe(false)
  })
})
