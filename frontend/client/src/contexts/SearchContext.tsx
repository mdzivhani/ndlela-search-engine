import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SearchParams {
  adults: number;
  children: number;
  checkIn?: string;
  checkOut?: string;
  location?: string;
}

interface SearchContextType {
  searchParams: SearchParams;
  setSearchParams: (params: SearchParams) => void;
  getTotalGuests: () => number;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    adults: 2,
    children: 0,
  });

  const getTotalGuests = () => searchParams.adults + searchParams.children;

  return (
    <SearchContext.Provider value={{ searchParams, setSearchParams, getTotalGuests }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}