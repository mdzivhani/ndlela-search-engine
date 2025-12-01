/**
 * Browse Page - Province and Attraction Discovery
 * Booking.com-style interface for exploring South African destinations
 */
import React, { useState } from 'react'
import { provinces } from '../data/provinces'
import { getAttractionsByProvince } from '../data/touristAttractions'
import ProvinceCards from '../components/ProvinceCards'
import AttractionCards from '../components/AttractionCards'
import Cart from '../components/Cart'

export default function Browse() {
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null)
  
  const selectedProvince = selectedProvinceId 
    ? provinces.find(p => p.id === selectedProvinceId)
    : null
  
  const attractions = selectedProvinceId 
    ? getAttractionsByProvince(selectedProvinceId)
    : []

  const handleBack = () => {
    setSelectedProvinceId(null)
  }

  return (
    <div className="browse-container">
      <header className="browse-header">
        <div className="header-content">
          {selectedProvince ? (
            <div className="back-navigation">
              <button onClick={handleBack} className="back-btn">
                ← Back to Provinces
              </button>
            </div>
          ) : (
            <h1>Discover South Africa</h1>
          )}
        </div>
      </header>

      <main className="browse-main">
        {!selectedProvinceId ? (
          <ProvinceCards 
            provinces={provinces} 
            onProvinceClick={setSelectedProvinceId}
          />
        ) : (
          <AttractionCards 
            attractions={attractions}
            provinceName={selectedProvince?.name}
          />
        )}
      </main>

      <Cart />
    </div>
  )
}
