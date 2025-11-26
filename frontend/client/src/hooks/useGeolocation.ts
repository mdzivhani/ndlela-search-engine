/**
 * Custom hook for handling browser geolocation with fallback to South Africa default
 */
import { useState, useEffect } from 'react'
import { UserLocation } from '../types/search'

// Default coordinates for South Africa (center of the country)
const DEFAULT_SA_LOCATION: UserLocation = {
  latitude: -28.4793,
  longitude: 24.6727,
  timestamp: Date.now(),
}

interface GeolocationState {
  location: UserLocation | null
  isLoading: boolean
  error: string | null
  hasPermission: boolean
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    isLoading: true,
    error: null,
    hasPermission: false,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        location: DEFAULT_SA_LOCATION,
        isLoading: false,
        error: 'Geolocation is not supported by your browser',
        hasPermission: false,
      })
      return
    }

    const successHandler = (position: GeolocationPosition) => {
      const location: UserLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      }

      setState({
        location,
        isLoading: false,
        error: null,
        hasPermission: true,
      })
    }

    const errorHandler = (error: GeolocationPositionError | { code: number }) => {
      let errorMessage = 'Unable to retrieve your location'

      switch (error.code) {
        case 1: // PERMISSION_DENIED
          errorMessage = 'Location permission denied'
          break
        case 2: // POSITION_UNAVAILABLE
          errorMessage = 'Location information unavailable'
          break
        case 3: // TIMEOUT
          errorMessage = 'Location request timed out'
          break
      }

      // Fall back to default South Africa location
      setState({
        location: DEFAULT_SA_LOCATION,
        isLoading: false,
        error: errorMessage,
        hasPermission: false,
      })
    }

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    })
  }, [])

  return state
}
