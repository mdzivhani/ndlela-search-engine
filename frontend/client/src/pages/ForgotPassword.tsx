import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../utils/apiClient'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'email' | 'reset' | 'success'>('email')
  const [email, setEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // B: Password policy validation helper (matches backend)
  const validatePassword = (password: string): { valid: boolean; error?: string } => {
    if (!password) {
      return { valid: false, error: 'Password is required' }
    }
    if (password.length < 8) {
      return { valid: false, error: 'Password must be at least 8 characters long' }
    }
    const hasNumberOrSpecial = /[\d!@#$%^&*(),.?":{}|<>]/.test(password)
    if (!hasNumberOrSpecial) {
      return { valid: false, error: 'Password must include a number or special character' }
    }
    return { valid: true }
  }

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await apiFetch<{ success: boolean; message: string; token?: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() })
      })

      if (response.success) {
        // A1: Store token returned from API
        if (response.token) {
          setResetToken(response.token)
        }
        setSuccess('Password reset token ready. Continue to reset your password.')
        setStep('reset')
        setEmail('')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process password reset request')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // B: Client-side validation before API call
    if (!resetToken.trim()) {
      setError('Reset token is required')
      return
    }

    if (!newPassword) {
      setError('New password is required')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.valid) {
      setError(passwordValidation.error || 'Password validation failed')
      return
    }

    setLoading(true)

    try {
      const response = await apiFetch<{ success: boolean; message: string }>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token: resetToken, newPassword })
      })

      if (response.success) {
        setSuccess('Password reset successful! Redirecting to login...')
        setStep('success')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '450px', width: '100%', padding: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111' }}>Reset Password</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Recover access to your account</p>

        {error && (
          <div style={{ padding: '1rem', backgroundColor: '#ffebee', borderRadius: '8px', border: '1px solid #ef5350', marginBottom: '1rem', color: '#c62828' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '1rem', backgroundColor: '#e8f5e9', borderRadius: '8px', border: '1px solid #4caf50', marginBottom: '1rem', color: '#2e7d32' }}>
            {success}
          </div>
        )}

        {step === 'email' && (
          <form onSubmit={handleRequestReset}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
              <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>Enter the email address associated with your account</p>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: loading ? '#ccc' : 'var(--primary-color)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginBottom: '1rem'
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = 'var(--primary-dark)')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = 'var(--primary-color)')}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <p style={{ textAlign: 'center', color: '#666' }}>
              Remember your password?{' '}
              <a href="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>Back to login</a>
            </p>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleResetPassword}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>Reset Token</label>
              <textarea
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="Reset token (should be pre-filled)"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
              />
              <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>Token should be automatically filled from the password reset link</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters with a number or special character"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
              <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>Minimum 8 characters with a number or special character (!@#$%^&*)</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !resetToken || !newPassword || !confirmPassword}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: loading ? '#ccc' : 'var(--primary-color)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginBottom: '1rem'
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = 'var(--primary-dark)')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = 'var(--primary-color)')}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', color: '#2e7d32' }}>Password Reset Successful</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Your password has been reset. Redirecting to login page...</p>
            <a href="/login" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', backgroundColor: 'var(--primary-color)', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: 600 }}>Go to Login</a>
          </div>
        )}
      </div>
    </div>
  )
}
