/**
 * ActivityMap Component
 * Interactive map showing activity/business locations with markers and clustering
 */
import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import type { Map as LeafletMap } from 'leaflet'
import { SearchResult, MapBounds, UserLocation } from '../types/search'
import 'leaflet/dist/leaflet.css'

interface ActivityMapProps {
  activities: SearchResult[]
  userLocation: UserLocation | null
  highlightedId?: string | null
  onMarkerClick?: (id: string) => void
  onMarkerHover?: (id: string | null) => void
  onBoundsChange?: (bounds: MapBounds) => void
  center?: [number, number]
  zoom?: number
}

// Component to handle map events
function MapEventHandler({
  onBoundsChange,
}: {
  onBoundsChange?: (bounds: MapBounds) => void
}) {
  const map = useMapEvents({
    moveend: () => {
      if (onBoundsChange) {
        const bounds = map.getBounds()
        onBoundsChange({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        })
      }
    },
  })

  return null
}

// Component to update map center when props change
function MapUpdater({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap()

  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom())
    }
  }, [center, zoom, map])

  return null
}

// SearchThisArea button component
function SearchThisAreaButton({ onClick }: { onClick: () => void }) {
  const [showButton, setShowButton] = useState(false)
  const map = useMap()

  useEffect(() => {
    const handleMoveEnd = () => {
      setShowButton(true)
    }

    map.on('moveend', handleMoveEnd)
    return () => {
      map.off('moveend', handleMoveEnd)
    }
  }, [map])

  if (!showButton) return null

  return (
    <div className="search-this-area-container">
      <button
        className="search-this-area-btn"
        onClick={() => {
          onClick()
          setShowButton(false)
        }}
      >
        Search this area
      </button>
    </div>
  )
}

export default function ActivityMap({
  activities,
  userLocation,
  highlightedId,
  onMarkerClick,
  onMarkerHover,
  onBoundsChange,
  center,
  zoom = 10,
}: ActivityMapProps) {
  const mapRef = useRef<LeafletMap | null>(null)
  const [searchThisAreaClicked, setSearchThisAreaClicked] = useState(false)

  // Default center to user location or SA default
  const defaultCenter: [number, number] = center || [
    userLocation?.latitude ?? -28.4793,
    userLocation?.longitude ?? 24.6727,
  ]

  const handleSearchThisArea = () => {
    setSearchThisAreaClicked(true)
    if (mapRef.current && onBoundsChange) {
      const bounds = mapRef.current.getBounds()
      onBoundsChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      })
    }
  }

  // Filter activities that have location data
  const validActivities = activities.filter(
    (activity) => activity.latitude !== undefined && activity.longitude !== undefined
  )

  return (
    <div className="activity-map-container">
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
        // @ts-ignore - MapContainer ref typing issue
        ref={mapRef}
      >
        {/* Modern Google Maps-style tiles using CartoDB Positron (light theme) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={20}
        />

        <MapUpdater center={center} zoom={zoom} />
        <MapEventHandler onBoundsChange={onBoundsChange} />
        <SearchThisAreaButton onClick={handleSearchThisArea} />

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            eventHandlers={{
              click: () => {},
            }}
          >
            <Popup>
              <div className="map-popup">
                <strong>You are here</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Activity markers */}
        {validActivities.map((activity) => (
          <Marker
            key={activity.id}
            position={[activity.latitude!, activity.longitude!]}
            eventHandlers={{
              click: () => onMarkerClick?.(activity.id),
              mouseover: () => onMarkerHover?.(activity.id),
              mouseout: () => onMarkerHover?.(null),
            }}
          >
            <Popup>
              <div className="map-popup">
                <h4>{activity.name}</h4>
                <p className="popup-category">{activity.category}</p>
                {activity.rating && (
                  <p className="popup-rating">★ {activity.rating.toFixed(1)}</p>
                )}
                {activity.priceFrom && (
                  <p className="popup-price">
                    From R{activity.priceFrom}
                    {activity.priceTo && ` - R${activity.priceTo}`}
                  </p>
                )}
                <button
                  className="popup-view-btn"
                  onClick={() => onMarkerClick?.(activity.id)}
                >
                  View details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
