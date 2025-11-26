import '@testing-library/jest-dom'

// Mock URL.createObjectURL and URL.revokeObjectURL for jsdom
global.URL.createObjectURL = vi.fn(() => 'mock-url')
global.URL.revokeObjectURL = vi.fn()

// Mock react-leaflet to avoid import errors in tests
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: () => <div data-testid="marker" />,
  Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
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

