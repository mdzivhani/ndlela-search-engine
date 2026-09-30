/**
 * Tourist Attractions Data
 * Links attractions to provinces and businesses
 */

export interface TouristAttraction {
  id: number
  name: string
  shortDescription: string
  imageUrl: string
  photoCredit?: string
  photoCreditUrl?: string
  businessId: number
  provinceId: number
}

export const attractionImages: Record<number, string> = {
  9001: "https://upload.wikimedia.org/wikipedia/commons/4/4e/TableMountainAerialCableway2018.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
  9002: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Aerial_view_of_Victoria_and_Alfred_Waterfront_%286252668243%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
  9003: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/Robben_Island_-_Cape_Town%2C_South_Africa_%283883849594%29.jpg/1920px-Robben_Island_-_Cape_Town%2C_South_Africa_%283883849594%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
  9004: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Kruger_Zebra.JPG/1920px-Kruger_Zebra.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
  9005: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/20131119_162543b.jpg/1920px-20131119_162543b.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
  9006: "https://zb2g8qspmxpc-u2909.pressidiumcdn.com/wp-content/uploads/2025/11/Theme-Park.jpg",
  9007: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Tamed_Cheetah_in_Lion_Park%2C_Johannesburg%2C_South_Africa.JPG/1920px-Tamed_Cheetah_in_Lion_Park%2C_Johannesburg%2C_South_Africa.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
}

export const touristAttractions: TouristAttraction[] = [
  // Western Cape attractions
  {
    id: 101,
    name: "Table Mountain Cableway",
    shortDescription: "Experience Cape Town from above with a 360° rotating cable car.",
    imageUrl: attractionImages[9001],
    photoCredit: "Fazielah Williams (CC BY-SA 4.0)",
    photoCreditUrl: "https://commons.wikimedia.org/wiki/File:TableMountainAerialCableway2018.jpg",
    businessId: 9001,
    provinceId: 2
  },
  {
    id: 102,
    name: "V&A Waterfront",
    shortDescription: "Shopping, restaurants and boat tours in a scenic harbour setting.",
    imageUrl: attractionImages[9002],
    photoCredit: "South African Tourism (CC BY 2.0)",
    photoCreditUrl: "https://commons.wikimedia.org/wiki/File:Aerial_view_of_Victoria_and_Alfred_Waterfront_(6252668243).jpg",
    businessId: 9002,
    provinceId: 2
  },
  {
    id: 103,
    name: "Robben Island Tour",
    shortDescription: "Historical tour where Nelson Mandela was imprisoned.",
    imageUrl: attractionImages[9003],
    photoCredit: "South African Tourism (CC BY 2.0)",
    photoCreditUrl: "https://commons.wikimedia.org/wiki/File:Robben_Island_-_Cape_Town,_South_Africa_(3883849594).jpg",
    businessId: 9003,
    provinceId: 2
  },
  // Mpumalanga attractions
  {
    id: 201,
    name: "Kruger National Park",
    shortDescription: "Big 5 safari experience in one of the largest game reserves.",
    imageUrl: attractionImages[9004],
    photoCredit: "Nithin bolar k (CC BY-SA 3.0)",
    photoCreditUrl: "https://commons.wikimedia.org/wiki/File:Kruger_Zebra.JPG",
    businessId: 9004,
    provinceId: 4
  },
  {
    id: 202,
    name: "Blyde River Canyon",
    shortDescription: "Scenic canyon viewpoints and boat rides.",
    imageUrl: attractionImages[9005],
    photoCredit: "Claudirene (CC BY-SA 3.0)",
    photoCreditUrl: "https://commons.wikimedia.org/wiki/File:20131119_162543b.jpg",
    businessId: 9005,
    provinceId: 4
  },
  // Gauteng attractions
  {
    id: 301,
    name: "Gold Reef City",
    shortDescription: "Theme park rides, casino and historical museum.",
    imageUrl: attractionImages[9006],
    photoCredit: "Gold Reef City",
    photoCreditUrl: "https://www.tsogosun.com/casino/gold-reef-city-theme-park/",
    businessId: 9006,
    provinceId: 1
  },
  {
    id: 302,
    name: "Lion and Safari Park",
    shortDescription: "Wildlife drive and guided lion tours.",
    imageUrl: attractionImages[9007],
    photoCredit: "Victorgrigas (CC BY-SA 3.0)",
    photoCreditUrl: "https://commons.wikimedia.org/wiki/File:Tamed_Cheetah_in_Lion_Park,_Johannesburg,_South_Africa.JPG",
    businessId: 9007,
    provinceId: 1
  }
]

// Helper function to get attractions by province
export function getAttractionsByProvince(provinceId: number): TouristAttraction[] {
  return touristAttractions.filter(attraction => attraction.provinceId === provinceId)
}
