import { SearchResult } from "./search";
export interface Listing extends SearchResult {
  gallery: string[];
  sample: boolean;
  verified: boolean;
  enquiryEnabled: boolean;
  priceBasis: string;
  priceUrl?: string;
  photoCredit?: string;
  photoCreditUrl?: string;
  updatedAt: string;
  accessibility: string;
  transport: string;
  languages: string | string[];
  cancellationPolicy: string;
  hours: string | Record<string, string>;
  contact: { phone: string; email: string; website?: string };
  services: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: string;
  }[];
  reviews?: {
    id: string;
    name: string;
    rating: number;
    text: string;
    created_at: string;
  }[];
  distanceKm?: number;
}
export interface Stop {
  listingId: string;
  name: string;
  day: number;
  cost: number;
  notes: string;
  estimatedTravelMinutes: number;
}
export interface Trip {
  title: string;
  destination: string;
  days: number;
  adults: number;
  budget: number;
  notes?: string;
  stops: Stop[];
  warnings: string[];
}
export interface SavedTrip {
  id: string;
  data: Trip;
  share_token?: string;
  votes?: { listing_id: string; count: number }[];
}
export interface Enquiry {
  id: string;
  listing_id: string;
  listing_name: string;
  status: string;
  response: string;
  name?: string;
  email?: string;
  quoted_amount?: string;
  data: { date: string; guests: number; message: string };
  created_at: string;
}
