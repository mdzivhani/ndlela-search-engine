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
  const { searchParams, getTotalGuests } = useSearch();
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
      {/* Header Section */}
      <div className="detail-header" style={{ 
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
        color: 'white',
        padding: '26px 20px'
      }}>
        <div className="container">
          <button 
            onClick={() => navigate(-1)} 
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '6px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '12px'
            }}
          >
            ← Back
          </button>
          <h1 style={{ margin: '6px 0 4px 0', fontSize: '2.1rem', lineHeight: '1.15' }}>{business.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.2rem' }}>
              ⭐ {business.rating} ({business.reviewCount} reviews)
            </span>
            <span style={{ 
              background: 'rgba(255,255,255,0.3)',
              padding: '4px 12px',
              borderRadius: '20px'
            }}>
              {business.type}
            </span>
            <span style={{ 
              fontSize: '0.85rem',
              opacity: 0.9,
              display: 'flex',
              alignItems: 'center'
            }}>
              📍 {business.location.city}, {business.location.province}
            </span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '30px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px', marginBottom: '32px' }}>
          {/* Main Content */}
          <div>
            {/* Description */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ marginBottom: '12px' }}>About</h2>
              <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                {business.description}
              </p>
            </section>

            {/* Services & Pricing */}
            <section style={{ marginBottom: '34px' }}>
              <h2 style={{ marginBottom: '14px' }}>Services & Pricing</h2>
              <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                {business.services.map((service) => {
                  const quantity = quantities[service.id] || 1;
                  const inCart = isInCart(service.id);
                  
                  return (
                    <Card 
                      key={service.id}
                      style={{
                        backgroundColor: inCart ? 'rgba(0, 87, 183, 0.06)' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                      className="service-card-compact"
                    >
                      {/* Service Info */}
                      <div style={{ flex: '1', minWidth: '0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <h3 style={{ 
                            margin: '0', 
                            color: 'var(--primary-color)', 
                            fontSize: '0.95rem', 
                            lineHeight: '1.2',
                            fontWeight: '600'
                          }}>
                            {service.name}
                          </h3>
                          <Badge>{service.category}</Badge>
                        </div>
                        <p style={{ 
                          margin: '0 0 4px 0', 
                          color: 'var(--text-secondary)', 
                          lineHeight: '1.4', 
                          fontSize: '0.85rem',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {service.description}
                        </p>
                        <Badge tone="primary" style={{ fontSize: '0.75rem' }}>⏱️ {service.duration}</Badge>
                      </div>
                      
                      {/* Price */}
                      <div style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: 'bold',
                        color: 'var(--primary-color)',
                        textAlign: 'center',
                        minWidth: '80px'
                      }}>
                        R{service.price.toLocaleString()}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Button variant="ghost" small
                          onClick={() => setQuantities(prev => ({ ...prev, [service.id]: Math.max(1, quantity - 1) }))}
                        >
                          −
                        </Button>
                        <span style={{ 
                          minWidth: '30px', 
                          textAlign: 'center', 
                          fontWeight: '600', 
                          fontSize: '0.8rem',
                          color: 'var(--text-primary)'
                        }}>
                          {quantity}
                        </span>
                        <Button variant="ghost" small
                          onClick={() => setQuantities(prev => ({ ...prev, [service.id]: quantity + 1 }))}
                        >
                          +
                        </Button>
                      </div>
                      
                      {/* Add to Cart Button */}
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
                        style={{ minWidth: '90px' }}
                      >
                        {inCart ? 'Added' : 'Add to Cart'}
                      </Button>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Amenities */}
            <section style={{ marginBottom: '34px' }}>
              <h2 style={{ marginBottom: '12px' }}>Amenities & Features</h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '10px'
              }}>
                {business.amenities.map((amenity, index) => (
                  <div 
                    key={index}
                    style={{
                      padding: '12px 15px',
                      background: 'var(--background-secondary)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ color: 'var(--primary-color)' }}>✓</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Operating Hours */}
            <section>
              <h2 style={{ marginBottom: '12px' }}>Operating Hours</h2>
              <div style={{ 
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '16px'
              }}>
                {Object.entries(business.hours).map(([day, hours]) => (
                  <div 
                    key={day}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px solid var(--border-color)'
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
            <section style={{ marginBottom: '26px' }}>
              <h2 style={{ marginBottom: '12px' }}>Location</h2>
              <Card style={{ overflow: 'hidden', padding: 0 }}>
                <MapContainer 
                  center={[business.location.coordinates.lat, business.location.coordinates.lng]} 
                  zoom={13} 
                  style={{ height: '300px', width: '100%' }}
                  scrollWheelZoom={scrollZoom}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[business.location.coordinates.lat, business.location.coordinates.lng]}>
                    <Popup>
                      <strong>{business.name}</strong><br />
                      {business.location.address}
                    </Popup>
                  </Marker>
                </MapContainer>
                {!scrollZoom && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 10px' }}>
                    <Button variant="ghost" small onClick={() => setScrollZoom(true)}>Enable scroll zoom</Button>
                  </div>
                )}
              </Card>
              <div style={{ padding: '12px', background: 'var(--background-secondary)', borderRadius: '8px' }}>
                <p style={{ margin: '5px 0' }}><strong>{business.location.address}</strong></p>
                <p style={{ margin: '5px 0', color: 'var(--text-secondary)' }}>
                  {business.location.city}, {business.location.province}
                </p>
                <p style={{ margin: '5px 0', color: 'var(--text-secondary)' }}>
                  {business.location.postalCode}
                </p>
              </div>
            </section>

            {/* Contact Info */}
            <section style={{ marginBottom: '26px' }}>
              <h2 style={{ marginBottom: '12px' }}>Contact</h2>
              <div style={{ 
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                    Phone
                  </span>
                  <a href={`tel:${business.contact.phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                    📞 {business.contact.phone}
                  </a>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                    Email
                  </span>
                  <a href={`mailto:${business.contact.email}`} style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                    ✉️ {business.contact.email}
                  </a>
                </div>
                {business.contact.website && (
                  <div>
                    <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                      Website
                    </span>
                    <a 
                      href={business.contact.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
                    >
                      🌐 Visit Website
                    </a>
                  </div>
                )}
              </div>
            </section>

            {/* CTA */}
            <button 
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1rem'
              }}
              onClick={() => alert('Booking functionality coming soon!')}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      <Cart />

      <style>{`
        .service-card:hover {
          box-shadow: 0 6px 18px rgba(0,0,0,0.12);
          transform: translateY(-3px);
        }
        .business-detail h2 { font-size: 1.25rem; line-height: 1.3; }
        .business-detail h3 { font-size: 1.05rem; }
        @media (max-width: 900px) {
          .detail-header { padding: 22px 16px !important; }
          .business-detail h1 { font-size: 1.8rem !important; }
          .business-detail .container { padding: 24px 16px !important; }
        }
        @media (max-width: 768px) {
          .business-detail .container > div { grid-template-columns: 1fr !important; }
          .service-card { padding: 14px !important; }
        }

        /* Responsive services grid: 3 cols desktop, 2 tablet, 1 mobile */
        @media (max-width: 1200px) {
          .service-card-compact { font-size: 0.95em; }
        }
        @media (max-width: 1024px) {
          .business-detail section:nth-of-type(2) > div { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 640px) {
          .business-detail section:nth-of-type(2) > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
