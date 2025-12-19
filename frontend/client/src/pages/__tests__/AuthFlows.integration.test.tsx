import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from '../Login'
import Register from '../Register'
import { ApiClientError } from '../../utils/apiClient'

const loginMock = vi.fn()
const registerMock = vi.fn()

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ login: loginMock, register: registerMock, isLoading: false }),
}))

describe('Auth flows error handling', () => {
  beforeEach(() => {
    loginMock.mockReset()
    registerMock.mockReset()
  })

  it('shows user-not-found message on login', async () => {
    loginMock.mockRejectedValueOnce(new ApiClientError('missing', { code: 'AUTH_USER_NOT_FOUND', status: 404, details: { error: { field: 'email' } } }))

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'missing@example.com' } })
    fireEvent.change(screen.getByLabelText(/Password/), { target: { value: 'Password1!' } })
    fireEvent.click(screen.getByRole('button', { name: /Login/ }))

    await waitFor(() => {
      expect(screen.getByText(/This email is not registered/)).toBeInTheDocument()
    })
  })

  it('shows weak password message on register', async () => {
    registerMock.mockRejectedValueOnce(new ApiClientError('weak', { code: 'AUTH_PASSWORD_WEAK', status: 400, details: { error: { field: 'password' } } }))

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    )

    fireEvent.change(screen.getByLabelText(/Full Name/), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/^Password/), { target: { value: 'weak' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/), { target: { value: 'weak' } })
    fireEvent.click(screen.getByRole('button', { name: /Create Account/ }))

    await waitFor(() => {
      expect(screen.getByText(/Password/)).toBeInTheDocument()
    })
  })

  it('blocks submit when passwords mismatch', async () => {
    registerMock.mockResolvedValueOnce(undefined)

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    )

    fireEvent.change(screen.getByLabelText(/Full Name/), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/^Password/), { target: { value: 'Password1!' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/), { target: { value: 'Mismatch' } })

    const submit = screen.getByRole('button', { name: /Create Account/ })
    expect(submit).toBeDisabled()
  })
})
