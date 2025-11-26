/**
 * Tests for useGeolocation hook
 */
import { renderHook, waitFor } from '@testing-library/react'
import { useGeolocation } from '../hooks/useGeolocation'

describe('useGeolocation', () => {
  const mockGeolocation = {
    getCurrentPosition: vi.fn(),
  }

  beforeAll(() => {
    // @ts-ignore
    global.navigator.geolocation = mockGeolocation
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return loading state initially', () => {
    const { result } = renderHook(() => useGeolocation())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.location).toBeNull()
  })

  it('should return user location when permission granted', async () => {
    const mockPosition = {
      coords: {
        latitude: -26.2041,
        longitude: 28.0473,
        accuracy: 10,
      },
      timestamp: Date.now(),
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition)
    })

    const { result } = renderHook(() => useGeolocation())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.hasPermission).toBe(true)
      expect(result.current.location).toEqual({
        latitude: mockPosition.coords.latitude,
        longitude: mockPosition.coords.longitude,
        accuracy: mockPosition.coords.accuracy,
        timestamp: mockPosition.timestamp,
      })
      expect(result.current.error).toBeNull()
    })
  })

  it('should fall back to default SA location when permission denied', async () => {
    const mockError = {
      code: 1, // PERMISSION_DENIED
      message: 'User denied geolocation',
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error(mockError)
    })

    const { result } = renderHook(() => useGeolocation())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.hasPermission).toBe(false)
      expect(result.current.location).toEqual({
        latitude: -28.4793,
        longitude: 24.6727,
        timestamp: expect.any(Number),
      })
      expect(result.current.error).toBe('Location permission denied')
    })
  })

  it('should handle position unavailable error', async () => {
    const mockError = {
      code: 2, // POSITION_UNAVAILABLE
      message: 'Position unavailable',
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error(mockError)
    })

    const { result } = renderHook(() => useGeolocation())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe('Location information unavailable')
    })
  })

  it('should handle timeout error', async () => {
    const mockError = {
      code: 3, // TIMEOUT
      message: 'Timeout',
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error(mockError)
    })

    const { result } = renderHook(() => useGeolocation())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe('Location request timed out')
    })
  })
})
