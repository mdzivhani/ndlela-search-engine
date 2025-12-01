/**
 * ProvinceCards Component
 * Displays South African provinces in a Booking.com-style card grid
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Province } from '../data/provinces'

interface ProvinceCardsProps {
  provinces: Province[]
  onProvinceClick?: (provinceId: number) => void
}

export default function ProvinceCards({ provinces, onProvinceClick }: ProvinceCardsProps) {
  const navigate = useNavigate()

  const handleClick = (province: Province) => {
    if (onProvinceClick) {
      onProvinceClick(province.id)
    }
  }

  return (
    <div className="provinces-container">
      <div className="provinces-header">
        <h2>Explore South African Provinces</h2>
        <p className="provinces-subtitle">Discover amazing destinations and experiences across South Africa</p>
      </div>
      
      <div className="provinces-grid">
        {provinces.map((province) => (
          <div
            key={province.id}
            className="province-card"
            onClick={() => handleClick(province)}
          >
            <div className="province-image-container">
              <img 
                src={province.imageUrl} 
                alt={province.name}
                className="province-image"
                loading="lazy"
              />
            </div>
            <div className="province-content">
              <h3 className="province-name">{province.name}</h3>
              {typeof province.attractionCount === 'number' && (
                <p className="province-count">
                  {province.attractionCount} {province.attractionCount === 1 ? 'attraction' : 'attractions'}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
