import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { mockBusinessDetails } from '../data/mockBusinessDetails';
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
  const business = id ? mockBusinessDetails[id] : null;

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

  return (
    <div className="business-detail">
      {/* Header Section */}
      <div className="detail-header" style={{ 
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
        color: 'white',
        padding: '40px 20px'
      }}>
        <div className="container">
          <button 
            onClick={() => navigate(-1)} 
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            ← Back
          </button>
          <h1 style={{ margin: '10px 0', fontSize: '2.5rem' }}>{business.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.2rem' }}>
              ⭐ {business.rating} ({business.reviewCount} reviews)
            </span>
            <span style={{ 
              background: 'rgba(255,255,255,0.3)',
              padding: '5px 15px',
              borderRadius: '20px'
            }}>
              {business.type}
            </span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '40px' }}>
          {/* Main Content */}
          <div>
            {/* Description */}
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ marginBottom: '15px' }}>About</h2>
              <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                {business.description}
              </p>
            </section>

            {/* Services & Pricing */}
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ marginBottom: '20px' }}>Services & Pricing</h2>
              <div style={{ display: 'grid', gap: '15px' }}>
                {business.services.map((service, index) => (
                  <div 
                    key={index}
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '20px',
                      transition: 'all 0.3s ease'
                    }}
                    className="service-card"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                      <h3 style={{ margin: 0, color: 'var(--primary-color)' }}>{service.name}</h3>
                      <span style={{ 
                        fontSize: '1.2rem', 
                        fontWeight: 'bold',
                        color: 'var(--primary-color)',
                        whiteSpace: 'nowrap',
                        marginLeft: '15px'
                      }}>
                        {service.price}
                      </span>
                    </div>
                    <p style={{ margin: '10px 0', color: 'var(--text-secondary)' }}>
                      {service.description}
                    </p>
                    {service.duration && (
                      <span style={{ 
                        fontSize: '0.9rem', 
                        color: 'var(--text-muted)',
                        display: 'inline-block',
                        marginTop: '5px'
                      }}>
                        ⏱️ {service.duration}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Amenities */}
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ marginBottom: '15px' }}>Amenities & Features</h2>
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
              <h2 style={{ marginBottom: '15px' }}>Operating Hours</h2>
              <div style={{ 
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '20px'
              }}>
                {Object.entries(business.hours).map(([day, hours]) => (
                  <div 
                    key={day}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 0',
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
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ marginBottom: '15px' }}>Location</h2>
              <div style={{ 
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '15px'
              }}>
                <MapContainer 
                  center={[business.location.coordinates.lat, business.location.coordinates.lng]} 
                  zoom={13} 
                  style={{ height: '300px', width: '100%' }}
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
              </div>
              <div style={{ padding: '15px', background: 'var(--background-secondary)', borderRadius: '8px' }}>
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
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ marginBottom: '15px' }}>Contact</h2>
              <div style={{ 
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '20px'
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
                padding: '15px',
                fontSize: '1.1rem'
              }}
              onClick={() => alert('Booking functionality coming soon!')}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .service-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .business-detail .container > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
