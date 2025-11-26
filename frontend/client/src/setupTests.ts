import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock URL.createObjectURL and URL.revokeObjectURL for jsdom
global.URL.createObjectURL = vi.fn(() => 'mock-url')
global.URL.revokeObjectURL = vi.fn()

// Mock react-leaflet to avoid import errors in tests
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => React.createElement('div', { 'data-testid': 'map-container' }, children),
  TileLayer: () => React.createElement('div', { 'data-testid': 'tile-layer' }),
  Marker: () => React.createElement('div', { 'data-testid': 'marker' }),
  Popup: ({ children }: any) => React.createElement('div', { 'data-testid': 'popup' }, children),
  useMap: () => ({
    setView: vi.fn(),
    flyTo: vi.fn(),
  }),
}))

// Mock leaflet to avoid import errors
vi.mock('leaflet', () => ({
  default: {
    icon: vi.fn(() => ({})),
    Icon: {
      Default: {
        prototype: {
          _getIconUrl: vi.fn(),
        },
      },
    },
  },
  icon: vi.fn(() => ({})),
}))

