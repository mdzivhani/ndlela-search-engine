import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BusinessDetail from './BusinessDetail';
import React from 'react';
import { CartProvider } from '../contexts/CartContext';
import { SearchProvider } from '../contexts/SearchContext';
import { AuthProvider } from '../contexts/AuthContext';

// Mock react-leaflet to avoid DOM/Leaflet complexities in jsdom
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid="map">{children}</div>,
  TileLayer: () => <div />,
  Marker: ({ children }: any) => <div>{children}</div>,
  Popup: ({ children }: any) => <div>{children}</div>
}));

// Mock extendedMockBusinesses if not already loaded in test env
vi.mock('../data/extendedMockBusinesses', async () => {
  const actual: any = await vi.importActual('../data/extendedMockBusinesses');
  return { extendedMockBusinesses: actual.extendedMockBusinesses };
});

describe('BusinessDetail public access and compact services', () => {
  it('renders services list and allows adding to cart without auth', () => {
    render(
      <AuthProvider>
        <SearchProvider>
          <CartProvider>
            <MemoryRouter initialEntries={["/business/1"]}>
              <Routes>
                <Route path="/business/:id" element={<BusinessDetail />} />
              </Routes>
            </MemoryRouter>
          </CartProvider>
        </SearchProvider>
      </AuthProvider>
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();

    // Services & Pricing section present
    expect(screen.getByText(/Services & Pricing/i)).toBeInTheDocument();

    // Find any Add to Cart button
    const addButtons = screen.getAllByRole('button', { name: /add to cart/i })
    expect(addButtons.length).toBeGreaterThan(0)
  });
});
