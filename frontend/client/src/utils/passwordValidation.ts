export interface PasswordStrength {
  isValid: boolean
  score: number
  message: string
  requirements: {
    minLength: boolean
    hasNumber: boolean
    hasSpecial: boolean
    hasUpper: boolean
    hasLower: boolean
  }
}

export function validatePasswordStrength(password: string): PasswordStrength {
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

export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return confirmPassword.length > 0 && password === confirmPassword
}
