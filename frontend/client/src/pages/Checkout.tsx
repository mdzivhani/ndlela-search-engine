import React, { useState } from 'react'
import { useCart } from '../contexts/CartContext'

export default function Checkout() {
  const { items, getTotalPrice } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirmPurchase = async () => {
    setIsProcessing(true)
    // Stub: simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsProcessing(false)
    // TODO: Implement actual purchase logic
    alert('Purchase confirmed (stub)')
  }

  if (items.length === 0) {
    return (
      <div className="checkout-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ marginBottom: '1rem', fontSize: '1.75rem', fontWeight: 600 }}>Checkout</h1>
        <p style={{ color: '#666' }}>Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="checkout-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Page Title */}
      <h1 style={{ marginBottom: '2rem', fontSize: '1.75rem', fontWeight: 600 }}>Checkout</h1>
      
      {/* Section 1: Items */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#333' }}>Items</h2>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
          {items.map((item, index) => (
            <div 
              key={item.serviceId} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                padding: '1rem', 
                borderBottom: index < items.length - 1 ? '1px solid #e5e7eb' : 'none',
                backgroundColor: '#fff'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem', color: '#111' }}>
                  {item.serviceName}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  {item.businessName}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  Qty: {item.quantity}
                </div>
              </div>
              <div style={{ fontWeight: 600, fontSize: '1rem', color: '#111', textAlign: 'right' }}>
                R{(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Order Summary */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#333' }}>Order Summary</h2>
        <div style={{ 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px', 
          padding: '1.5rem',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111' }}>Total</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0057b7' }}>
              R{getTotalPrice().toLocaleString()}
            </span>
          </div>
        </div>
      </section>

      {/* Confirm Purchase Button */}
      <div>
        <button 
          className="btn-primary" 
          onClick={handleConfirmPurchase}
          disabled={isProcessing || items.length === 0}
          style={{ 
            width: '100%', 
            padding: '0.875rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            opacity: isProcessing ? 0.7 : 1,
            cursor: isProcessing ? 'not-allowed' : 'pointer'
          }}
        >
          {isProcessing ? 'Processing...' : 'Confirm purchase'}
        </button>
      </div>
    </div>
  )
}
