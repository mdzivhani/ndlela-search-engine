import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { extendedMockBusinesses } from '../data/extendedMockBusinesses';
import { useCart } from '../contexts/CartContext';
import { useSearch } from '../contexts/SearchContext';
import { useState, useEffect } from 'react';
import Cart from '../components/Cart';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function BusinessDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { getTotalGuests } = useSearch();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  
  const business = id ? extendedMockBusinesses[id] : null;

  // Initialize quantities based on search parameters
  useEffect(() => {
    if (business && getTotalGuests() > 0) {
      const defaultQuantity = getTotalGuests();
      const initialQuantities: { [key: string]: number } = {};
      business.services.forEach(service => {
        initialQuantities[service.id] = defaultQuantity;
      });
      setQuantities(initialQuantities);
    }
  }, [business, getTotalGuests]);

  if (!business) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>Business not found</h2>
        <button onClick={() => navigate('/search')} className="btn-primary" style={{ marginTop: '20px' }}>
          Back to Search
        </button>
      </div>
    );
  }

  const [scrollZoom, setScrollZoom] = useState(false);
  return (
    <div className="business-detail">
      {/* Header Section - Compact */}
      <div className="detail-header-compact" style={{ 
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
        color: 'white',
        padding: '14px 20px'
      }}>
        <div className="container">
          <button 
            onClick={() => navigate(-1)} 
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '4px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              marginBottom: '8px'
            }}
          >
            ← Back
          </button>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.75rem', lineHeight: '1.2', fontWeight: '700' }}>{business.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '0.9rem' }}>
            <span>⭐ {business.rating.toFixed(1)} ({business.reviewCount})</span>
            <span style={{ 
              background: 'rgba(255,255,255,0.25)',
              padding: '2px 8px',
              borderRadius: '16px',
              fontSize: '0.8rem'
            }}>
              {business.type}
            </span>
            <span style={{ opacity: 0.85 }}>📍 {business.location.city}</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '24px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Main Content */}
          <div>
            {/* Description */}
            <section style={{ marginBottom: '28px' }}>
              <h2 style={{ marginBottom: '10px', fontSize: '1.1rem', fontWeight: '600' }}>About</h2>
              <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', margin: '0', fontSize: '0.95rem' }}>
                {business.description}
              </p>
            </section>

            {/* Services & Pricing */}
            <section style={{ marginBottom: '28px' }}>
              <h2 style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: '600' }}>Services & Pricing</h2>
              <div className="services-modern-grid-compact">
                {business.services.map((service) => {
                  const quantity = quantities[service.id] || 1;
                  const inCart = isInCart(service.id);
                  
                  return (
                    <div 
                      key={service.id}
                      className={`service-card-compact ${inCart ? 'in-cart' : ''}`}
                    >
                      {/* Service Header */}
                      <div className="service-card-header-compact">
                        <div className="service-title-section-compact">
                          <h3 className="service-title-compact">{service.name}</h3>
                          <div className="service-badges-compact">
                            <Badge>{service.category}</Badge>
                            <span className="service-duration-compact">⏱️ {service.duration}</span>
                          </div>
                        </div>
                        <div className="service-price-section-compact">
                          <span className="price-amount-compact">R{service.price.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {/* Service Description */}
                      <p className="service-description-compact">
                        {service.description}
                      </p>
                      
                      {/* Service Actions */}
                      <div className="service-actions-compact">
                        <div className="quantity-controls-compact">
                          <button 
                            className="qty-btn-compact"
                            onClick={() => setQuantities(prev => ({ ...prev, [service.id]: Math.max(1, quantity - 1) }))}
                          >
                            −
                          </button>
                          <span className="qty-value-compact">{quantity}</span>
                          <button 
                            className="qty-btn-compact"
                            onClick={() => setQuantities(prev => ({ ...prev, [service.id]: quantity + 1 }))}
                          >
                            +
                          </button>
                        </div>
                        <Button
                          onClick={() => {
                            addToCart({
                              serviceId: service.id,
                              businessId: business.id,
                              businessName: business.name,
                              serviceName: service.name,
                              price: service.price,
                              duration: service.duration,
                              category: service.category
                            }, quantity);
                          }}
                          variant={inCart ? 'secondary' : 'primary'}
                          small
                          style={{ flex: 1 }}
                        >
                          {inCart ? '✓ Added' : 'Add to Cart'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Amenities */}
            <section style={{ marginBottom: '28px' }}>
              <h2 style={{ marginBottom: '12px', fontSize: '1.1rem', fontWeight: '600' }}>Amenities & Features</h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '8px'
              }}>
                {business.amenities.map((amenity, index) => (
                  <div 
                    key={index}
                    style={{
                      padding: '8px 12px',
                      background: 'var(--background-secondary)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.9rem'
                    }}
                  >
                    <span style={{ color: 'var(--primary-color)', fontSize: '0.85rem' }}>✓</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Operating Hours */}
            <section>
              <h2 style={{ marginBottom: '12px', fontSize: '1.1rem', fontWeight: '600' }}>Operating Hours</h2>
              <div style={{ 
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                {Object.entries(business.hours).map(([day, hours], idx) => (
                  <div 
                    key={day}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      fontSize: '0.9rem',
                      borderBottom: idx < Object.entries(business.hours).length - 1 ? '1px solid var(--border-color)' : 'none'
                    }}
                  >
                    <span style={{ fontWeight: '500' }}>{day}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{hours}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div>
            {/* Map */}
            <section style={{ marginBottom: '20px' }}>
              <h2 style={{ marginBottom: '10px', fontSize: '1.1rem', fontWeight: '600' }}>Location</h2>
              <Card style={{ overflow: 'hidden', padding: 0 }}>
                <MapContainer 
                  center={[business.location.coordinates.lat, business.location.coordinates.lng]} 
                  zoom={13} 
                  style={{ height: '220px', width: '100%' }}
                  scrollWheelZoom={scrollZoom}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                  />
                  <Marker position={[business.location.coordinates.lat, business.location.coordinates.lng]}>
                    <Popup>
                      <strong>{business.name}</strong><br />
                      {business.location.address}
                    </Popup>
                  </Marker>
                </MapContainer>
                {!scrollZoom && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '6px 8px', fontSize: '0.85rem' }}>
                    <Button variant="ghost" small onClick={() => setScrollZoom(true)}>Scroll zoom</Button>
                  </div>
                )}
              </Card>
              <div style={{ padding: '10px 12px', background: 'var(--background-secondary)', borderRadius: '6px', marginTop: '8px', fontSize: '0.9rem' }}>
                <p style={{ margin: '4px 0', fontWeight: '600' }}>{business.location.address}</p>
                <p style={{ margin: '3px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {business.location.city}, {business.location.province} {business.location.postalCode}
                </p>
              </div>
            </section>

            {/* Contact Info */}
            <section style={{ marginBottom: '20px' }}>
              <h2 style={{ marginBottom: '10px', fontSize: '1.1rem', fontWeight: '600' }}>Contact</h2>
              <div style={{ 
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '12px',
                fontSize: '0.9rem'
              }}>
                <div style={{ marginBottom: '10px' }}>
                  <a href={`tel:${business.contact.phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '500' }}>
                    📞 {business.contact.phone}
                  </a>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <a href={`mailto:${business.contact.email}`} style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '500', fontSize: '0.85rem', wordBreak: 'break-all' }}>
                    ✉️ {business.contact.email}
                  </a>
                </div>
                {business.contact.website && (
                  <div>
                    <a 
                      href={business.contact.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '500' }}
                    >
                      🌐 Visit Website
                    </a>
                  </div>
                )}
              </div>
            </section>

            {/* CTA */}
            <Button 
              style={{
                width: '100%',
                padding: '10px'
              }}
              onClick={() => alert('Booking functionality coming soon!')}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>

      <Cart />

      <style>{`
        .detail-header-compact {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
        }
        
        .business-detail h2 { font-size: 1.1rem; line-height: 1.3; font-weight: 600; }
        .business-detail section { margin-bottom: 28px; }
        .business-detail section:last-of-type { margin-bottom: 0; }
        
        /* Compact Services Grid */
        .services-modern-grid-compact {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 12px;
        }

        .service-card-compact {
          background: white;
          border: 1px solid var(--gray-200);
          border-radius: 6px;
          padding: 12px;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .service-card-compact:hover {
          border-color: var(--primary-color);
          box-shadow: 0 2px 8px rgba(0, 87, 183, 0.08);
          transform: translateY(-1px);
        }

        .service-card-compact.in-cart {
          background: rgba(0, 87, 183, 0.02);
          border-color: var(--primary-color);
        }

        .service-card-header-compact {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
        }

        .service-title-section-compact {
          flex: 1;
          min-width: 0;
        }

        .service-title-compact {
          margin: 0 0 4px 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--gray-900);
          line-height: 1.2;
        }

        .service-badges-compact {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
        }

        .service-duration-compact {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-size: 0.75rem;
          color: var(--gray-600);
          background: var(--gray-100);
          padding: 2px 6px;
          border-radius: 3px;
        }

        .service-price-section-compact {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          flex-shrink: 0;
        }

        .price-amount-compact {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary-color);
          line-height: 1;
        }

        .service-description-compact {
          margin: 0;
          color: var(--gray-700);
          line-height: 1.5;
          font-size: 0.875rem;
        }

        .service-actions-compact {
          display: flex;
          align-items: center;
          gap: 6px;
          padding-top: 6px;
          border-top: 1px solid var(--gray-200);
        }

        .quantity-controls-compact {
          display: flex;
          align-items: center;
          gap: 3px;
          background: var(--gray-50);
          border: 1px solid var(--gray-300);
          border-radius: 4px;
          padding: 2px 4px;
        }

        .qty-btn-compact {
          background: white;
          border: 1px solid var(--gray-300);
          border-radius: 3px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--gray-700);
          transition: all 0.15s ease;
          padding: 0;
        }

        .qty-btn-compact:hover {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .qty-value-compact {
          min-width: 24px;
          text-align: center;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--gray-900);
        }

        @media (max-width: 1200px) {
          .services-modern-grid-compact {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          }
        }

        @media (max-width: 900px) {
          .detail-header-compact { padding: 12px 16px !important; }
          .business-detail h1 { font-size: 1.5rem !important; }
          .business-detail .container { padding: 20px 16px !important; }
          .business-detail > div:first-of-type > div { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 768px) {
          .services-modern-grid-compact { grid-template-columns: 1fr; }
          .service-card-compact { padding: 10px; }
          .service-card-header-compact { flex-direction: column; }
          .service-price-section-compact { align-items: flex-start; width: 100%; }
        }
      `}</style>
    </div>
  );
}
