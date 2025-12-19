import React, { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ApiClientError } from '../utils/apiClient'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    try {
      await login(email, password)
      const from = (location.state as any)?.from?.pathname || '/search'
      navigate(from, { replace: true })
    } catch (err) {
      if (err instanceof ApiClientError) {
        // Handle specific error codes
        if (err.status === 404) {
          setError('No account found with this email. Please register first.')
        } else if (err.status === 401 || err.code === 'WRONG_PASSWORD') {
          setError('Incorrect password. Please try again.')
        } else if (err.code === 'NETWORK_ERROR') {
          setError('Network error. Please check your connection and try again.')
        } else {
          setError(err.message || 'Login failed. Please try again.')
        }
      } else {
        setError(err instanceof Error ? err.message : 'Login failed')
      }
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
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
              disabled={isLoading}
              placeholder="••••••••"
              required
            />
            <Link to="/forgot-password" className="form-link">Forgot password?</Link>
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  )
}
