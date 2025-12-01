/**
 * Tourist Attractions Data
 * Links attractions to provinces and businesses
 */

export interface TouristAttraction {
  id: number
  name: string
  shortDescription: string
  imageUrl: string
  businessId: number
  provinceId: number
}

export const touristAttractions: TouristAttraction[] = [
  // Western Cape attractions
  {
    id: 101,
    name: "Table Mountain Cableway",
    shortDescription: "Experience Cape Town from above with a 360° rotating cable car.",
    imageUrl: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",
    businessId: 9001,
    provinceId: 2
  },
  {
    id: 102,
    name: "V&A Waterfront",
    shortDescription: "Shopping, restaurants and boat tours in a scenic harbour setting.",
    imageUrl: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80",
    businessId: 9002,
    provinceId: 2
  },
  {
    id: 103,
    name: "Robben Island Tour",
    shortDescription: "Historical tour where Nelson Mandela was imprisoned.",
    imageUrl: "https://images.unsplash.com/photo-1536152470836-b943b246224c?w=800&q=80",
    businessId: 9003,
    provinceId: 2
  },
  // Mpumalanga attractions
  {
    id: 201,
    name: "Kruger National Park",
    shortDescription: "Big 5 safari experience in one of the largest game reserves.",
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    businessId: 9004,
    provinceId: 4
  },
  {
    id: 202,
    name: "Blyde River Canyon",
    shortDescription: "Scenic canyon viewpoints and boat rides.",
    imageUrl: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80",
    businessId: 9005,
    provinceId: 4
  },
  // Gauteng attractions
  {
    id: 301,
    name: "Gold Reef City",
    shortDescription: "Theme park rides, casino and historical museum.",
    imageUrl: "https://images.unsplash.com/photo-1594818379496-da1e345b0ded?w=800&q=80",
    businessId: 9006,
    provinceId: 1
  },
  {
    id: 302,
    name: "Lion and Safari Park",
    shortDescription: "Wildlife drive and guided lion tours.",
    imageUrl: "https://images.unsplash.com/photo-1535338454770-a8bdb3d6eb56?w=800&q=80",
    businessId: 9007,
    provinceId: 1
  }
]

// Helper function to get attractions by province
export function getAttractionsByProvince(provinceId: number): TouristAttraction[] {
  return touristAttractions.filter(attraction => attraction.provinceId === provinceId)
}
