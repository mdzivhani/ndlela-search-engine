import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { SearchResult } from '../types/search'

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

interface MapViewProps {
  results: SearchResult[]
  selectedResult?: SearchResult | null
  onMarkerClick?: (result: SearchResult) => void
}

export default function MapView({ results, selectedResult, onMarkerClick }: MapViewProps) {
  // Calculate center based on results with locations
  const resultsWithLocation = results.filter(r => r.location)
  
  const center: [number, number] = resultsWithLocation.length > 0
    ? [
        resultsWithLocation.reduce((sum, r) => sum + (r.location?.lat || 0), 0) / resultsWithLocation.length,
        resultsWithLocation.reduce((sum, r) => sum + (r.location?.lng || 0), 0) / resultsWithLocation.length
      ]
    : [-30.5595, 22.9375] // South Africa center

  if (resultsWithLocation.length === 0) {
    return (
      <div className="map-placeholder">
        <p>No location data available for these results</p>
      </div>
    )
  }

  return (
    <MapContainer
      center={center}
      zoom={6}
      style={{ height: '500px', width: '100%', borderRadius: '8px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {resultsWithLocation.map((result) => {
        if (!result.location) return null
        const { lat, lng } = result.location
        return (
        <Marker
          key={result.id}
          position={[lat, lng]}
          icon={DefaultIcon}
          eventHandlers={{
            click: () => onMarkerClick?.(result)
          }}
        >
          <Popup>
            <div className="map-popup">
              <h3 className="map-popup-title">{result.name}</h3>
              <p className="map-popup-description">
                {result.description}
              </p>
              <div className="map-popup-rating">
                <strong>Rating:</strong> ★ {result.rating.toFixed(1)}
              </div>
              <div className="map-popup-category">
                <strong>Category:</strong> {result.category}
              </div>
              <div className="map-popup-address">
                {result.location.address}, {result.location.city}
              </div>
            </div>
          </Popup>
        </Marker>
        )
      })}
    </MapContainer>
  )
}
