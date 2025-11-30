import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import { CartProvider } from '../../contexts/CartContext'
import Cart from '../Cart'

function Wrapper({ initialEntries = ['/'] }: { initialEntries?: string[] }) {
  return (
    <AuthProvider>
      <CartProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/" element={<Cart />} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </CartProvider>
    </AuthProvider>
  )
}

vi.stubGlobal('alert', () => {})

describe('Checkout requires login', () => {
  it('redirects guest to login and preserves intent', () => {
    // Seed cart items in localStorage
    localStorage.setItem('ndlela_cart_items', JSON.stringify([
      { serviceId:'s1', businessId:'b1', businessName:'Biz', serviceName:'Svc', price:100, quantity:1, duration:'1h', category:'Cat' }
    ]))

    render(<Wrapper />)

    // Cart renders (cart widget exists)
    // Since the Cart component renders null when empty, we emulate clicking checkout via DOM presence
    // Create a button similar to checkout button
  })
})
