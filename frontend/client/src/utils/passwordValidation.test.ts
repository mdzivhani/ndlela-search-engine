import { describe, it, expect } from 'vitest'
import { validatePasswordStrength, passwordsMatch } from './passwordValidation'

describe('password validation', () => {
  it('requires min length and number/special', () => {
    const weak = validatePasswordStrength('short')
    expect(weak.isValid).toBe(false)
    expect(weak.requirements.minLength).toBe(false)

    const noNumber = validatePasswordStrength('longpassword')
    expect(noNumber.isValid).toBe(false)
    expect(noNumber.requirements.hasNumber || noNumber.requirements.hasSpecial).toBe(false)

    const good = validatePasswordStrength('Password1!')
    expect(good.isValid).toBe(true)
  })

  it('calculates match correctly', () => {
    expect(passwordsMatch('pass', '')).toBe(false)
    expect(passwordsMatch('pass', 'pass')).toBe(true)
    expect(passwordsMatch('pass', 'different')).toBe(false)
  })
})
