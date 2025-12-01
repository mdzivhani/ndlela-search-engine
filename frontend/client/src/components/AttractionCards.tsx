/**
 * AttractionCards Component
 * Displays tourist attractions in a modern Booking.com-style card layout
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { TouristAttraction } from '../data/touristAttractions'

interface AttractionCardsProps {
  attractions: TouristAttraction[]
  provinceName?: string
}

export default function AttractionCards({ attractions, provinceName }: AttractionCardsProps) {
  const navigate = useNavigate()

  const handleClick = (businessId: number) => {
    navigate(`/business/${businessId}`)
  }

  if (attractions.length === 0) {
    return (
      <div className="no-attractions">
        <p>No attractions available in this province yet. Check back soon!</p>
      </div>
    )
  }

  return (
    <div className="attractions-container">
      {provinceName && (
        <div className="attractions-header">
          <h2>Explore {provinceName}</h2>
          <p className="attractions-subtitle">{attractions.length} {attractions.length === 1 ? 'attraction' : 'attractions'} to discover</p>
        </div>
      )}
      
      <div className="attractions-grid">
        {attractions.map((attraction) => (
          <div
            key={attraction.id}
            className="attraction-card"
            onClick={() => handleClick(attraction.businessId)}
          >
            <div className="attraction-image-container">
              <img 
                src={attraction.imageUrl} 
                alt={attraction.name}
                className="attraction-image"
                loading="lazy"
              />
            </div>
            <div className="attraction-content">
              <h3 className="attraction-name">{attraction.name}</h3>
              <p className="attraction-description">{attraction.shortDescription}</p>
              <button className="attraction-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
