import React from 'react'
import { useCart } from '../contexts/CartContext'

export default function Checkout() {
  const { items, getTotalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="checkout-container">
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="checkout-container" style={{ padding: '1rem' }}>
      <h1>Checkout</h1>
      <div className="order-summary" style={{ marginTop: '1rem' }}>
        {items.map((item) => (
          <div key={item.serviceId} className="summary-item" style={{ display:'flex', justifyContent:'space-between', padding:'0.5rem 0', borderBottom:'1px solid #eee' }}>
            <div>
              <strong>{item.serviceName}</strong>
              <div style={{ color:'#666', fontSize:'0.9rem' }}>{item.businessName}</div>
            </div>
            <div>
              R{(item.price * item.quantity).toLocaleString()} ({item.quantity})
            </div>
          </div>
        ))}
        <div className="summary-total" style={{ display:'flex', justifyContent:'space-between', padding:'0.75rem 0', fontWeight:600 }}>
          <span>Total</span>
          <span>R{getTotalPrice().toLocaleString()}</span>
        </div>
      </div>
      <div style={{ marginTop:'1rem' }}>
        <button className="btn-primary">Confirm Purchase (stub)</button>
      </div>
    </div>
  )
}
