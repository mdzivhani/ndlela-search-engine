import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

type AuthMode = 'login' | 'register'

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register, isLoading } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  
  // Register form state
  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!loginEmail || !loginPassword) {
      setError('Email and password are required')
      return
    }

    try {
      await login(loginEmail, loginPassword)
      const from = (location.state as any)?.from?.pathname || '/search'
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!registerEmail || !registerPassword || !confirmPassword || !registerName) {
      setError('All fields are required')
      return
    }

    if (registerPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (registerPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    try {
      await register(registerEmail, registerPassword, registerName)
      setSuccess('Registration successful! Logging you in...')
      setTimeout(() => {
        const from = (location.state as any)?.from?.pathname || '/search'
        navigate(from, { replace: true })
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card modern">
        <div className="auth-header">
          <h1>Welcome to Ndlela</h1>
          <p className="auth-subtitle">Discover and explore South African tourism</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login')
              setError('')
              setSuccess('')
            }}
            type="button"
          >
            Login
          </button>
          <button
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register')
              setError('')
              setSuccess('')
            }}
            type="button"
          >
            Register
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                disabled={isLoading}
                placeholder="you@example.com"
                className="form-input"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Enter your password"
                className="form-input"
                required
                autoComplete="current-password"
              />
              <Link to="/forgot-password" className="form-link">Forgot password?</Link>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary btn-auth">
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="register-name">Full Name</label>
              <input
                id="register-name"
                type="text"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                disabled={isLoading}
                placeholder="John Doe"
                className="form-input"
                required
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-email">Email Address</label>
              <input
                id="register-email"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                disabled={isLoading}
                placeholder="you@example.com"
                className="form-input"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                disabled={isLoading}
                placeholder="At least 8 characters"
                className="form-input"
                required
                autoComplete="new-password"
              />
              <small className="form-help">Minimum 8 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Re-enter your password"
                className="form-input"
                required
                autoComplete="new-password"
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary btn-auth">
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
