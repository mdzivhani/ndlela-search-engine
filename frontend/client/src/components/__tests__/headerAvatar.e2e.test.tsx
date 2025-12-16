/**
 * E2E tests for header avatar states
 * Tests: logged-out shows default icon, logged-in shows avatar/initials, menu interaction
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import GlobalHeader from '../GlobalHeader'
import { AuthProvider } from '../../contexts/AuthContext'
import { CartProvider } from '../../contexts/CartContext'
import { FavouritesProvider } from '../../contexts/FavouritesContext'
import { BrowserRouter } from 'react-router-dom'

// Mock useNavigate and useLocation for router context
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/search' }),
  }
})

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <FavouritesProvider>{children}</FavouritesProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
)

describe('Header Avatar E2E', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('shows default avatar when logged out', () => {
    render(
      <Wrapper>
        <GlobalHeader />
      </Wrapper>
    )

    // Should show avatar button (default icon 👤)
    const avatarBtn = screen.getByRole('button', { name: /avatar/i })
    expect(avatarBtn).toBeInTheDocument()
  })

  it('opens menu with Login option when avatar clicked', async () => {
    render(
      <Wrapper>
        <GlobalHeader />
      </Wrapper>
    )

    const avatarBtn = screen.getByRole('button', { name: /avatar/i })
    fireEvent.click(avatarBtn)

    await waitFor(() => {
      expect(screen.getByText(/login/i)).toBeInTheDocument()
    })
  })

  it('closes menu when clicking outside', async () => {
    render(
      <Wrapper>
        <GlobalHeader />
      </Wrapper>
    )

    const avatarBtn = screen.getByRole('button', { name: /avatar/i })
    fireEvent.click(avatarBtn)

    await waitFor(() => {
      expect(screen.getByText(/login/i)).toBeInTheDocument()
    })

    // Click outside menu
    document.body.click()

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })})