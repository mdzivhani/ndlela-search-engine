import React, { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ApiClientError } from '../utils/apiClient'

// Password strength validation
interface PasswordStrength {
  isValid: boolean
  score: number // 0-4
  message: string
  requirements: {
    minLength: boolean
    hasNumber: boolean
    hasSpecial: boolean
    hasUpper: boolean
    hasLower: boolean
  }
}

function validatePasswordStrength(password: string): PasswordStrength {
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

export default function Register() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  })

  const passwordStrength = useMemo(() => validatePasswordStrength(password), [password])
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0
  const passwordsDontMatch = confirmPassword.length > 0 && !passwordsMatch

  const isFormValid = useMemo(() => {
    return (
      name.trim().length > 0 &&
      email.includes('@') &&
      passwordStrength.isValid &&
      passwordsMatch
    )
  }, [name, email, passwordStrength.isValid, passwordsMatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Final validation
    if (!isFormValid) {
      setError('Please complete all fields correctly')
      return
    }

    try {
      await register(email, password, name)
      setSuccess('Account created successfully! Redirecting...')
      setTimeout(() => {
        navigate('/search', { replace: true })
      }, 1500)
    } catch (err) {
      if (err instanceof ApiClientError) {
        // Handle specific error codes
        if (err.status === 409) {
          setError('An account with this email already exists. Please login instead.')
        } else if (err.code === 'VALIDATION_ERROR') {
          setError(err.message)
        } else {
          setError(err.message || 'Registration failed. Please try again.')
        }
      } else {
        setError(err instanceof Error ? err.message : 'Registration failed')
      }
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join Ndlela to discover amazing activities</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched({ ...touched, password: true })}
              disabled={isLoading}
              placeholder="••••••••"
              required
            />
            {touched.password && password.length > 0 && (
              <div className={`password-strength strength-${passwordStrength.score}`}>
                <div className="strength-bar">
                  <div className="strength-fill" style={{ width: `${(passwordStrength.score + 1) * 20}%` }} />
                </div>
                <span className="strength-text">{passwordStrength.message}</span>
              </div>
            )}
            {touched.password && !passwordStrength.isValid && password.length > 0 && (
              <div className="field-hint error">
                Password must be at least 8 characters with a number or special character
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setTouched({ ...touched, confirmPassword: true })}
              disabled={isLoading}
              placeholder="••••••••"
              required
            />
            {touched.confirmPassword && confirmPassword.length > 0 && (
              <div className={`field-hint ${passwordsMatch ? 'success' : 'error'}`}>
                {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
              </div>
            )}
          </div>

          <button type="submit" disabled={isLoading || !isFormValid} className="btn-primary">
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  )
}
