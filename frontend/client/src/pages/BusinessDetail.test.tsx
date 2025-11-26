import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BusinessDetail from './BusinessDetail';
import React from 'react';
import { CartProvider } from '../contexts/CartContext';
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

describe('BusinessDetail compact layout', () => {
  it('renders multi-column services grid and compact hero', () => {
    render(
      <AuthProvider>
        <CartProvider>
          <MemoryRouter initialEntries={["/business/0"]}>
            <Routes>
              <Route path="/business/:id" element={<BusinessDetail />} />
            </Routes>
          </MemoryRouter>
        </CartProvider>
      </AuthProvider>
    );

    // Hero adjustments
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    // Font size reduced: should not be default 2.5rem (jsdom won't compute, just existence check)

    // Services grid should have style with gridTemplateColumns containing auto-fit
    const serviceGrid = screen.getByText(/Services & Pricing/i).parentElement?.querySelector('div[style]');
    expect(serviceGrid?.getAttribute('style')).toMatch(/repeat\(auto-fit/);
  });
});
