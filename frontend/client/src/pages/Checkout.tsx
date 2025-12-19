import React, { useState } from 'react'
import { useCart } from '../contexts/CartContext'

export default function Checkout() {
  const { items, getTotalPrice } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirmPurchase = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsProcessing(false)
    alert('Purchase confirmed (stub)')
  }

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: '#111' }}>Your Cart is Empty</h1>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>No items yet. Explore our services and add something amazing!</p>
          <a href="/browse" style={{ display: 'inline-block', padding: '0.75rem 2rem', backgroundColor: 'var(--primary-color)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, transition: 'all 0.2s' }}>Continue Shopping</a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingY: '2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111', margin: 0 }}>Checkout</h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem' }}>Complete your purchase and secure your booking</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
          {/* Main Content */}
          <div>
            {/* Order Items Section */}
            <section style={{ background: '#fff', borderRadius: '12px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: '#111', borderBottom: '2px solid var(--primary-color)', paddingBottom: '1rem' }}>Order Items ({items.length})</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {items.map((item, index) => (
                  <div key={item.serviceId} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    padding: '1rem',
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#fff',
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8'
                  }}>
                    <div style={{ flex: 1, marginRight: '1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem', color: '#111' }}>
                        {item.serviceName}
                      </div>
                      <div style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                        {item.businessName}
                      </div>
                      <div style={{ color: '#999', fontSize: '0.85rem' }}>
                        Qty: <span style={{ fontWeight: 600 }}>{item.quantity}</span> × R{item.price.toLocaleString()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-color)' }}>
                      R{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Billing & Payment Info */}
            <section style={{ background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: '#111', borderBottom: '2px solid var(--primary-color)', paddingBottom: '1rem' }}>Billing Details</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem', color: '#333' }}>Full Name</label>
                  <input type="text" placeholder="John Doe" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem', color: '#333' }}>Email</label>
                  <input type="email" placeholder="john@example.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem', color: '#333' }}>Phone Number</label>
                <input type="tel" placeholder="+27 123 456 7890" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem', color: '#333' }}>Address</label>
                <input type="text" placeholder="123 Main Street" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box', marginBottom: '0.5rem' }} />
                <input type="text" placeholder="City" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box', marginBottom: '0.5rem' }} />
                <input type="text" placeholder="Postal Code" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }} />
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#1565c0' }}>💳 Payment processing is a stub. This is a demo checkout.</p>
              </div>
            </section>
          </div>

          {/* Sidebar - Order Summary */}
          <aside style={{ position: 'sticky', top: '1rem' }}>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '2px solid var(--primary-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: '#111' }}>Order Summary</h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', marginBottom: '0.75rem', borderBottom: '1px solid #e8e8e8' }}>
                <span style={{ color: '#666' }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>R{getTotalPrice().toLocaleString()}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', marginBottom: '0.75rem', borderBottom: '1px solid #e8e8e8' }}>
                <span style={{ color: '#666' }}>Taxes & Fees</span>
                <span style={{ fontWeight: 600 }}>R0.00</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--primary-color)' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111' }}>Total</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-color)' }}>R{getTotalPrice().toLocaleString()}</span>
              </div>

              <button 
                onClick={handleConfirmPurchase}
                disabled={isProcessing}
                style={{ 
                  width: '100%', 
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  backgroundColor: isProcessing ? '#ccc' : 'var(--primary-color)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  marginBottom: '0.75rem'
                }}
                onMouseEnter={(e) => !isProcessing && (e.currentTarget.style.backgroundColor = 'var(--primary-dark)')}
                onMouseLeave={(e) => !isProcessing && (e.currentTarget.style.backgroundColor = 'var(--primary-color)')}
              >
                {isProcessing ? '⏳ Processing...' : '✓ Complete Purchase'}
              </button>

              <a href="/browse" style={{ display: 'block', textAlign: 'center', padding: '0.75rem', color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600, borderRadius: '6px', transition: 'all 0.2s', backgroundColor: '#f0f0f0' }}>Continue Shopping</a>

              <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', fontSize: '0.85rem', color: '#666', textAlign: 'center' }}>
                <p style={{ margin: '0.5rem 0' }}>🔒 Secure checkout</p>
                <p style={{ margin: '0.5rem 0' }}>Your information is protected</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
