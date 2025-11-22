import React from 'react'
import { SearchResult } from '../types/search'

interface BusinessDetailsProps {
  result: SearchResult
  onClose?: () => void
}

export default function BusinessDetails({ result, onClose }: BusinessDetailsProps) {
  return (
    <div className="business-details-overlay" onClick={onClose}>
      <div className="business-details-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="business-details-header">
          <h2>{result.name}</h2>
          <div className="business-rating">★ {result.rating.toFixed(1)}</div>
        </div>

        <p className="business-description">{result.description}</p>

        <div className="business-category">
          <span className="category-badge">{result.category}</span>
        </div>

        {result.location && (
          <div className="business-section">
            <h3>📍 Location</h3>
            <p className="location-text">
              {result.location.address}<br />
              {result.location.city}, {result.location.province}
            </p>
          </div>
        )}

        {result.amenities && result.amenities.length > 0 && (
          <div className="business-section">
            <h3>🏨 Amenities</h3>
            <div className="tags-list">
              {result.amenities.map((amenity, index) => (
                <span key={index} className="tag amenity-tag">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        {result.activities && result.activities.length > 0 && (
          <div className="business-section">
            <h3>🎯 Activities</h3>
            <div className="tags-list">
              {result.activities.map((activity, index) => (
                <span key={index} className="tag activity-tag">
                  {activity}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
