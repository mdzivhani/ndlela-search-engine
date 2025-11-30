import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './Cart.css';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return null; // Don't show cart if empty
  }

  return (
    <div className="cart-widget">
      <div className="cart-header">
        <h3>My Cart</h3>
        <span className="cart-badge">{getTotalItems()}</span>
      </div>
      
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.serviceId} className="cart-item">
            <div className="cart-item-details">
              <h4>{item.serviceName}</h4>
              <p className="cart-item-business">{item.businessName}</p>
              <p className="cart-item-price">R{item.price.toLocaleString()} × {item.quantity} {item.quantity === 1 ? 'person' : 'people'}</p>
            </div>
            
            <div className="cart-item-actions">
              <div className="quantity-controls">
                <button
                  onClick={() => updateQuantity(item.serviceId, item.quantity - 1)}
                  className="qty-btn"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="qty-display">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.serviceId, item.quantity + 1)}
                  className="qty-btn"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              
              <button
                onClick={() => removeFromCart(item.serviceId)}
                className="remove-btn"
                aria-label="Remove item"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-footer">
        <div className="cart-total">
          <span>Total:</span>
          <span className="total-price">R{getTotalPrice().toLocaleString()}</span>
        </div>
        <button 
          className="checkout-btn" 
          onClick={() => {
            if (user) {
              navigate('/checkout')
            } else {
              navigate('/login', { state: { from: { pathname: '/checkout' } } })
            }
          }}
        >
          {user ? 'Checkout' : 'Login to Checkout'}
        </button>
      </div>
    </div>
  );
}
