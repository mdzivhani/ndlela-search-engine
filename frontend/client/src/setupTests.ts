import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock URL.createObjectURL and URL.revokeObjectURL for jsdom
global.URL.createObjectURL = vi.fn(() => 'mock-url')
global.URL.revokeObjectURL = vi.fn()

// Mock FileReader for image processing tests
global.FileReader = class MockFileReader {
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null
  onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null
  result: string | ArrayBuffer | null = null
  
  readAsDataURL(_blob: Blob) {
    // Simulate async read
    setTimeout(() => {
      this.result = 'data:image/png;base64,mock'
      if (this.onload) {
        this.onload({ target: this } as any)
      }
    }, 0)
  }
} as any

// Mock Image for image processing tests
global.Image = class MockImage {
  onload: ((this: GlobalEventHandlers, ev: Event) => any) | null = null
  onerror: ((this: GlobalEventHandlers, ev: Event) => any) | null = null
  src: string = ''
  width: number = 100
  height: number = 100
  
  constructor() {
    // Simulate async load
    setTimeout(() => {
      if (this.onload) {
        this.onload({} as any)
      }
    }, 0)
  }
} as any

// Mock HTMLCanvasElement for image processing tests
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  drawImage: vi.fn(),
  getImageData: vi.fn(() => ({
    data: new Uint8ClampedArray(4),
  })),
  canvas: { width: 100, height: 100 },
})) as any

HTMLCanvasElement.prototype.toBlob = vi.fn(function(callback: BlobCallback) {
  setTimeout(() => {
    callback(new Blob(['mock'], { type: 'image/jpeg' }))
  }, 0)
}) as any

// Mock react-leaflet to avoid import errors in tests
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => React.createElement('div', { 'data-testid': 'map-container' }, children),
  TileLayer: () => React.createElement('div', { 'data-testid': 'tile-layer' }),
  Marker: () => React.createElement('div', { 'data-testid': 'marker' }),
  Popup: ({ children }: any) => React.createElement('div', { 'data-testid': 'popup' }, children),
  useMap: () => ({
    setView: vi.fn(),
    flyTo: vi.fn(),
    getZoom: vi.fn(() => 10),
    getBounds: vi.fn(() => ({
      getNorth: () => 0,
      getSouth: () => 0,
      getEast: () => 0,
      getWest: () => 0,
    })),
    on: vi.fn(),
    off: vi.fn(),
  }),
  useMapEvents: (handlers: any) => {
    // Return a mock map object that the component can use
    return {
      setView: vi.fn(),
      flyTo: vi.fn(),
      getZoom: vi.fn(() => 10),
      getBounds: vi.fn(() => ({
        getNorth: () => 0,
        getSouth: () => 0,
        getEast: () => 0,
        getWest: () => 0,
      })),
    }
  },
}))

// Mock leaflet to avoid import errors
vi.mock('leaflet', () => {
  const mockIcon = vi.fn(() => ({}))
  return {
    default: {
      icon: mockIcon,
      Icon: {
        Default: {
          prototype: {
            _getIconUrl: vi.fn(),
          },
        },
      },
      Marker: {
        prototype: {
          options: {
            icon: {},
          },
        },
      },
    },
    icon: mockIcon,
  }
})

