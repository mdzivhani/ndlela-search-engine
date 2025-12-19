/**
 * South African Provinces Data
 * Provides province information for the destination-based navigation
 */

export interface Province {
  id: number
  name: string
  imageUrl: string
  attractionCount?: number
}

export const provinces: Province[] = [
  { 
    id: 1, 
    name: "Gauteng", 
    imageUrl: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=800&q=80",
    attractionCount: 2
  },
  { 
    id: 2, 
    name: "Western Cape", 
    imageUrl: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",
    attractionCount: 3
  },
  { 
    id: 3, 
    name: "KwaZulu-Natal", 
    imageUrl: "https://images.unsplash.com/photo-1569163139394-de4798aa62b1?w=800&q=80",
    attractionCount: 0
  },
  { 
    id: 4, 
    name: "Mpumalanga", 
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    attractionCount: 2
  },
  { 
    id: 5, 
    name: "Limpopo", 
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    attractionCount: 0
  },
  { 
    id: 6, 
    name: "North West", 
    imageUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80",
    attractionCount: 0
  },
  { 
    id: 7, 
    name: "Free State", 
    imageUrl: "https://images.unsplash.com/photo-1484318571209-661cf29a69c3?w=800&q=80",
    attractionCount: 0
  },
  { 
    id: 8, 
    name: "Northern Cape", 
    imageUrl: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&q=80",
    attractionCount: 0
  },
  { 
    id: 9, 
    name: "Eastern Cape", 
    imageUrl: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=80",
    attractionCount: 0
  }
]
