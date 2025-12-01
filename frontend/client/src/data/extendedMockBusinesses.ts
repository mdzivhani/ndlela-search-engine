// Extended mock data for all search results with full business details
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
}

export interface Location {
  address: string;
  city: string;
  province: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface ExtendedBusiness {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  location: Location;
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  hours: {
    [key: string]: string;
  };
  amenities: string[];
  services: Service[];
  gallery: string[];
}

export const extendedMockBusinesses: { [key: string]: ExtendedBusiness } = {
  '1': {
    id: '1',
    name: 'Kruger Game Lodge',
    description: 'Luxury safari lodge offering guided game drives, accommodation, and authentic African bush experience.',
    category: 'Accommodation',
    rating: 4.8,
    reviewCount: 445,
    location: {
      address: 'Kruger National Park, Southern Section',
      city: 'Hazyview',
      province: 'Mpumalanga',
      coordinates: { lat: -25.0403, lng: 31.0969 }
    },
    contact: {
      phone: '+27 13 735 5355',
      email: 'reservations@krugergamelodge.co.za',
      website: 'https://krugergamelodge.co.za'
    },
    hours: {
      Monday: 'Open 24 hours',
      Tuesday: 'Open 24 hours',
      Wednesday: 'Open 24 hours',
      Thursday: 'Open 24 hours',
      Friday: 'Open 24 hours',
      Saturday: 'Open 24 hours',
      Sunday: 'Open 24 hours'
    },
    amenities: ['Swimming Pool', 'Restaurant', 'Bar', 'Spa', 'WiFi', 'Parking', 'Room Service', 'Boma Fire Pit', 'Wildlife Viewing Deck', 'Gift Shop'],
    services: [
      {
        id: 's1-1',
        name: 'Morning Game Drive',
        description: 'Early morning safari with experienced ranger in open 4x4 vehicle, coffee stop included.',
        price: 650,
        duration: '3-4 hours',
        category: 'Safari'
      },
      {
        id: 's1-2',
        name: 'Sunset Game Drive',
        description: 'Evening safari with sundowner drinks, excellent for spotting predators.',
        price: 650,
        duration: '3-4 hours',
        category: 'Safari'
      },
      {
        id: 's1-3',
        name: 'Full Day Safari Package',
        description: 'Morning and evening game drives with all meals and accommodation included.',
        price: 2400,
        duration: 'Full day',
        category: 'Safari'
      },
      {
        id: 's1-4',
        name: 'Bush Walk Experience',
        description: 'Guided walking safari with armed ranger, track animals on foot.',
        price: 480,
        duration: '2-3 hours',
        category: 'Walking Safari'
      },
      {
        id: 's1-5',
        name: 'Photography Safari',
        description: 'Specialized wildlife photography session with professional photographer guide.',
        price: 950,
        duration: '4 hours',
        category: 'Photography'
      }
    ],
    gallery: [
      'https://via.placeholder.com/800x600/8D6E63/FFFFFF?text=Safari+Lodge',
      'https://via.placeholder.com/800x600/795548/FFFFFF?text=Game+Drive',
      'https://via.placeholder.com/800x600/A1887F/FFFFFF?text=Wildlife'
    ]
  },
  '2': {
    id: '2',
    name: 'Table Mountain Tours',
    description: 'Guided hiking and cable car tours with stunning views of Cape Town and surroundings.',
    category: 'Tours',
    rating: 4.9,
    reviewCount: 324,
    location: {
      address: '1 Tafelberg Road',
      city: 'Cape Town',
      province: 'Western Cape',
      coordinates: { lat: -33.9628, lng: 18.4098 }
    },
    contact: {
      phone: '+27 21 424 8181',
      email: 'info@tablemountaintours.co.za',
      website: 'https://tablemountaintours.co.za'
    },
    hours: {
      Monday: '8:00 AM - 6:00 PM',
      Tuesday: '8:00 AM - 6:00 PM',
      Wednesday: '8:00 AM - 6:00 PM',
      Thursday: '8:00 AM - 6:00 PM',
      Friday: '8:00 AM - 6:00 PM',
      Saturday: '8:00 AM - 7:00 PM',
      Sunday: '8:00 AM - 7:00 PM'
    },
    amenities: ['Parking', 'Restaurant', 'WiFi', 'Restrooms', 'Gift Shop', 'Wheelchair Accessible', 'First Aid', 'Lockers', 'Cable Car'],
    services: [
      {
        id: 's2-1',
        name: 'Cable Car Round Trip',
        description: 'Scenic cable car ride to the summit with 360° rotating floor and panoramic views.',
        price: 395,
        duration: '2-3 hours',
        category: 'Cable Car'
      },
      {
        id: 's2-2',
        name: 'Guided Hiking Tour',
        description: 'Professional guide takes you through the Platteklip Gorge route to the summit.',
        price: 850,
        duration: '4-5 hours',
        category: 'Hiking'
      },
      {
        id: 's2-3',
        name: 'Sunset Cable Car Experience',
        description: 'Evening cable car ride with sunset views and complimentary refreshments.',
        price: 650,
        duration: '3 hours',
        category: 'Cable Car'
      },
      {
        id: 's2-4',
        name: 'Full Day Adventure Package',
        description: 'Morning hike up, lunch at summit restaurant, cable car down. Includes guide and meals.',
        price: 1200,
        duration: 'Full day (8 hours)',
        category: 'Hiking'
      }
    ],
    gallery: [
      'https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Table+Mountain+View',
      'https://via.placeholder.com/800x600/7CB342/FFFFFF?text=Cable+Car',
      'https://via.placeholder.com/800x600/FF7043/FFFFFF?text=Summit+View'
    ]
  },
  '3': {
    id: '3',
    name: 'Cape Town Spa & Wellness',
    description: 'Full-service spa with traditional African treatments, massage therapy, and holistic wellness programs.',
    category: 'Wellness',
    rating: 4.7,
    reviewCount: 298,
    location: {
      address: '45 Kloof Street',
      city: 'Cape Town',
      province: 'Western Cape',
      coordinates: { lat: -33.9284, lng: 18.4160 }
    },
    contact: {
      phone: '+27 21 422 0909',
      email: 'bookings@capetownspa.co.za',
      website: 'https://capetownspa.co.za'
    },
    hours: {
      Monday: '9:00 AM - 8:00 PM',
      Tuesday: '9:00 AM - 8:00 PM',
      Wednesday: '9:00 AM - 8:00 PM',
      Thursday: '9:00 AM - 9:00 PM',
      Friday: '9:00 AM - 9:00 PM',
      Saturday: '9:00 AM - 9:00 PM',
      Sunday: '10:00 AM - 7:00 PM'
    },
    amenities: ['Sauna', 'Steam Room', 'Jacuzzi', 'Relaxation Lounge', 'Changing Rooms', 'Parking', 'WiFi', 'Tea Bar', 'Retail Shop'],
    services: [
      {
        id: 's3-1',
        name: 'Traditional African Massage',
        description: 'Full body massage using indigenous herbs and oils, 60 minutes of pure relaxation.',
        price: 550,
        duration: '1 hour',
        category: 'Massage'
      },
      {
        id: 's3-2',
        name: 'Hot Stone Therapy',
        description: 'Heated stone massage to release tension and improve circulation.',
        price: 680,
        duration: '90 minutes',
        category: 'Massage'
      },
      {
        id: 's3-3',
        name: 'Couples Spa Package',
        description: 'Side-by-side massages, facial treatments, and private jacuzzi session.',
        price: 1800,
        duration: '2.5 hours',
        category: 'Package'
      },
      {
        id: 's3-4',
        name: 'Detox Body Wrap',
        description: 'Purifying clay wrap with essential oils followed by moisturizing treatment.',
        price: 720,
        duration: '90 minutes',
        category: 'Body Treatment'
      },
      {
        id: 's3-5',
        name: 'Full Day Wellness Retreat',
        description: 'Massage, facial, body scrub, lunch, and access to all facilities.',
        price: 2200,
        duration: '6 hours',
        category: 'Package'
      }
    ],
    gallery: [
      'https://via.placeholder.com/800x600/9C27B0/FFFFFF?text=Spa+Interior',
      'https://via.placeholder.com/800x600/7B1FA2/FFFFFF?text=Treatment+Room',
      'https://via.placeholder.com/800x600/AB47BC/FFFFFF?text=Relaxation+Area'
    ]
  },
  '4': {
    id: '4',
    name: 'Winelands Wine Tasting',
    description: 'Premium wine tasting experiences in Stellenbosch wine region.',
    category: 'Food & Drink',
    rating: 4.6,
    reviewCount: 287,
    location: {
      address: 'R310 Wine Route',
      city: 'Stellenbosch',
      province: 'Western Cape',
      coordinates: { lat: -33.9321, lng: 18.8602 }
    },
    contact: {
      phone: '+27 21 883 9988',
      email: 'info@winelandstasting.co.za',
      website: 'https://winelandstasting.co.za'
    },
    hours: {
      Monday: '9:00 AM - 6:00 PM',
      Tuesday: '9:00 AM - 6:00 PM',
      Wednesday: '9:00 AM - 6:00 PM',
      Thursday: '9:00 AM - 6:00 PM',
      Friday: '9:00 AM - 7:00 PM',
      Saturday: '9:00 AM - 7:00 PM',
      Sunday: '10:00 AM - 5:00 PM'
    },
    amenities: ['Wine Cellar', 'Tasting Room', 'Restaurant', 'Parking', 'Gift Shop', 'Wheelchair Accessible', 'Gardens', 'Picnic Areas', 'WiFi'],
    services: [
      {
        id: 's4-1',
        name: 'Classic Wine Tasting',
        description: 'Taste 5 premium wines including Cabernet, Merlot, and Pinotage varieties.',
        price: 180,
        duration: '1 hour',
        category: 'Wine Tasting'
      },
      {
        id: 's4-2',
        name: 'Wine & Cheese Pairing',
        description: 'Curated selection of wines paired with artisanal local cheeses.',
        price: 320,
        duration: '1.5 hours',
        category: 'Wine Tasting'
      },
      {
        id: 's4-3',
        name: 'Cellar Tour & Tasting',
        description: 'Behind-the-scenes cellar tour with winemaker, plus premium wine tasting.',
        price: 450,
        duration: '2 hours',
        category: 'Tour'
      },
      {
        id: 's4-4',
        name: 'Full Winelands Day Tour',
        description: 'Visit 4 estates, tastings at each, gourmet lunch, and transport included.',
        price: 1850,
        duration: '8 hours',
        category: 'Tour'
      }
    ],
    gallery: [
      'https://via.placeholder.com/800x600/8E24AA/FFFFFF?text=Wine+Cellar',
      'https://via.placeholder.com/800x600/D32F2F/FFFFFF?text=Wine+Tasting',
      'https://via.placeholder.com/800x600/7CB342/FFFFFF?text=Vineyards'
    ]
  },
  '5': {
    id: '5',
    name: 'Garden Route Adventure Park',
    description: 'Outdoor activities including zip-lining, hiking, and rock climbing.',
    category: 'Activities',
    rating: 4.5,
    reviewCount: 198,
    location: {
      address: 'N2 Highway, Storms River',
      city: 'Plettenberg Bay',
      province: 'Eastern Cape',
      coordinates: { lat: -34.0259, lng: 23.8878 }
    },
    contact: {
      phone: '+27 44 534 8906',
      email: 'adventures@gardenroutepark.co.za',
      website: 'https://gardenroutepark.co.za'
    },
    hours: {
      Monday: '7:00 AM - 5:00 PM',
      Tuesday: '7:00 AM - 5:00 PM',
      Wednesday: '7:00 AM - 5:00 PM',
      Thursday: '7:00 AM - 5:00 PM',
      Friday: '7:00 AM - 6:00 PM',
      Saturday: '7:00 AM - 6:00 PM',
      Sunday: '8:00 AM - 5:00 PM'
    },
    amenities: ['Free Parking', 'Bike Rentals', 'Cafe', 'Restrooms', 'Equipment Storage', 'Changing Rooms', 'Safety Gear Provided', 'Picnic Areas', 'WiFi'],
    services: [
      {
        id: 's5-1',
        name: 'Zip-Lining Canopy Tour',
        description: '10 platforms through indigenous forest with the longest slide at 211m.',
        price: 795,
        duration: '2.5 hours',
        category: 'Zip-Lining'
      },
      {
        id: 's5-2',
        name: 'Mountain Bike Trail Pass',
        description: 'Full-day access to 25km of scenic mountain bike trails with varying difficulty levels.',
        price: 250,
        duration: 'Full day',
        category: 'Mountain Biking'
      },
      {
        id: 's5-3',
        name: 'Guided Forest Hike',
        description: 'Expert-led nature walk through indigenous forest with wildlife spotting opportunities.',
        price: 380,
        duration: '3 hours',
        category: 'Hiking'
      },
      {
        id: 's5-4',
        name: 'Mountain Bike Rental & Gear',
        description: 'Premium mountain bike rental with helmet and protective gear included.',
        price: 320,
        duration: 'Half day (4 hours)',
        category: 'Mountain Biking'
      },
      {
        id: 's5-5',
        name: 'Adventure Combo Package',
        description: 'Zip-lining tour + guided hike + lunch at the cafe. Best value experience.',
        price: 1450,
        duration: '6 hours',
        category: 'Combo'
      }
    ],
    gallery: [
      'https://via.placeholder.com/800x600/8E24AA/FFFFFF?text=Zip+Line',
      'https://via.placeholder.com/800x600/43A047/FFFFFF?text=Mountain+Biking',
      'https://via.placeholder.com/800x600/FB8C00/FFFFFF?text=Forest+Trail'
    ]
  },
  '6': {
    id: '6',
    name: 'East London Beach Resort',
    description: 'Beachfront resort with water sports and entertainment.',
    category: 'Accommodation',
    rating: 4.4,
    reviewCount: 412,
    location: {
      address: 'Marine Drive, Orient Beach',
      city: 'East London',
      province: 'Eastern Cape',
      coordinates: { lat: -33.0292, lng: 27.9119 }
    },
    contact: {
      phone: '+27 43 722 4820',
      email: 'reservations@elbeachresort.co.za',
      website: 'https://elbeachresort.co.za'
    },
    hours: {
      Monday: 'Open 24 hours',
      Tuesday: 'Open 24 hours',
      Wednesday: 'Open 24 hours',
      Thursday: 'Open 24 hours',
      Friday: 'Open 24 hours',
      Saturday: 'Open 24 hours',
      Sunday: 'Open 24 hours'
    },
    amenities: ['Beach Access', 'Swimming Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Free WiFi', 'Parking', 'Room Service', 'Concierge'],
    services: [
      {
        id: 's6-1',
        name: 'Surfing Lessons',
        description: 'Professional surf instructor, board and wetsuit included for all skill levels.',
        price: 450,
        duration: '2 hours',
        category: 'Water Sports'
      },
      {
        id: 's6-2',
        name: 'Kayak Rental',
        description: 'Single or double kayak rental with safety equipment and beach launch.',
        price: 180,
        duration: '1 hour',
        category: 'Water Sports'
      },
      {
        id: 's6-3',
        name: 'Snorkeling Tour',
        description: 'Guided snorkeling experience at nearby reef with all equipment provided.',
        price: 580,
        duration: '3 hours',
        category: 'Water Sports'
      },
      {
        id: 's6-4',
        name: 'Sunset Cruise',
        description: 'Luxury catamaran cruise with drinks and snacks along the coastline.',
        price: 850,
        duration: '2.5 hours',
        category: 'Boat Tours'
      },
      {
        id: 's6-5',
        name: 'Deep Sea Fishing',
        description: 'Half-day fishing charter with experienced crew, tackle, and bait included.',
        price: 1200,
        duration: '4 hours',
        category: 'Fishing'
      }
    ],
    gallery: [
      'https://via.placeholder.com/800x600/0277BD/FFFFFF?text=Beach+View',
      'https://via.placeholder.com/800x600/00ACC1/FFFFFF?text=Water+Sports',
      'https://via.placeholder.com/800x600/FF6F00/FFFFFF?text=Sunset'
    ]
  },
  '7': {
    id: '7',
    name: 'Durban Aquarium & Museum',
    description: 'Interactive aquarium and cultural museum experiences.',
    category: 'Attractions',
    rating: 4.6,
    reviewCount: 523,
    location: {
      address: '1 Bell Street, Esplanade',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      coordinates: { lat: -29.8587, lng: 31.0218 }
    },
    contact: {
      phone: '+27 31 328 8000',
      email: 'info@durbanaquarium.co.za',
      website: 'https://durbanaquarium.co.za'
    },
    hours: {
      Monday: '9:00 AM - 5:00 PM',
      Tuesday: '9:00 AM - 5:00 PM',
      Wednesday: '9:00 AM - 5:00 PM',
      Thursday: '9:00 AM - 5:00 PM',
      Friday: '9:00 AM - 6:00 PM',
      Saturday: '9:00 AM - 6:00 PM',
      Sunday: '9:00 AM - 5:00 PM'
    },
    amenities: ['Parking', 'Gift Shop', 'Cafe', 'Restrooms', 'Wheelchair Accessible', 'Lockers', 'Audio Guides', 'Touch Pools', 'WiFi'],
    services: [
      {
        id: 's7-1',
        name: 'General Admission',
        description: 'Full access to aquarium exhibits, touch pools, and museum galleries.',
        price: 120,
        duration: '2-3 hours',
        category: 'Admission'
      },
      {
        id: 's7-2',
        name: 'Behind-the-Scenes Tour',
        description: 'Exclusive access to filtration systems, feeding areas, and meet the aquarists.',
        price: 280,
        duration: '1.5 hours',
        category: 'Tour'
      },
      {
        id: 's7-3',
        name: 'Shark Dive Experience',
        description: 'Cage-free shark dive with ragged-tooth sharks (certified divers only).',
        price: 950,
        duration: '2 hours',
        category: 'Diving'
      },
      {
        id: 's7-4',
        name: 'Penguin Encounter',
        description: 'Interactive experience feeding and learning about African penguins.',
        price: 380,
        duration: '45 minutes',
        category: 'Animal Encounter'
      },
      {
        id: 's7-5',
        name: 'Family Day Pass',
        description: 'Admission for 2 adults + 2 children, plus guided tour and souvenir photo.',
        price: 480,
        duration: 'Full day',
        category: 'Admission'
      }
    ],
    gallery: [
      'https://via.placeholder.com/800x600/0277BD/FFFFFF?text=Aquarium',
      'https://via.placeholder.com/800x600/1565C0/FFFFFF?text=Shark+Tank',
      'https://via.placeholder.com/800x600/00838F/FFFFFF?text=Penguins'
    ]
  },
  '8': {
    id: '8',
    name: 'Knysna Oyster Farm Tour',
    description: 'Oyster farming demonstrations and seafood restaurants.',
    category: 'Food & Drink',
    rating: 4.7,
    reviewCount: 341,
    location: {
      address: 'Thesen Island, Knysna Lagoon',
      city: 'Knysna',
      province: 'Western Cape',
      coordinates: { lat: -34.0364, lng: 23.0470 }
    },
    contact: {
      phone: '+27 44 382 0995',
      email: 'tours@knysnaoysterfarm.co.za',
      website: 'https://knysnaoysterfarm.co.za'
    },
    hours: {
      Monday: '10:00 AM - 6:00 PM',
      Tuesday: '10:00 AM - 6:00 PM',
      Wednesday: '10:00 AM - 6:00 PM',
      Thursday: '10:00 AM - 6:00 PM',
      Friday: '10:00 AM - 8:00 PM',
      Saturday: '10:00 AM - 8:00 PM',
      Sunday: '10:00 AM - 6:00 PM'
    },
    amenities: ['Waterfront Dining', 'Parking', 'Restrooms', 'Gift Shop', 'WiFi', 'Wheelchair Accessible', 'Outdoor Seating', 'Kids Play Area', 'Boat Tours'],
    services: [
      {
        id: 's8-1',
        name: 'Oyster Tasting Experience',
        description: 'Sample 12 fresh oysters with champagne and lemon, learn harvesting techniques.',
        price: 220,
        duration: '1 hour',
        category: 'Tasting'
      },
      {
        id: 's8-2',
        name: 'Farm Tour & Tasting',
        description: 'Boat tour of oyster beds, farming demonstration, and tasting platter.',
        price: 450,
        duration: '2 hours',
        category: 'Tour'
      },
      {
        id: 's8-3',
        name: 'Seafood Platter for Two',
        description: 'Oysters, mussels, calamari, prawns, and grilled fish with sides.',
        price: 680,
        duration: 'Meal',
        category: 'Dining'
      },
      {
        id: 's8-4',
        name: 'Sunset Lagoon Cruise',
        description: 'Evening boat cruise with oysters, sparkling wine, and sunset views.',
        price: 520,
        duration: '1.5 hours',
        category: 'Boat Tours'
      }
    ],
    gallery: [
      'https://via.placeholder.com/800x600/00897B/FFFFFF?text=Oyster+Farm',
      'https://via.placeholder.com/800x600/00796B/FFFFFF?text=Fresh+Oysters',
      'https://via.placeholder.com/800x600/0277BD/FFFFFF?text=Lagoon+View'
    ]
  },
  '9': {
    id: '9',
    name: 'Mpumalanga Hiking Trail',
    description: 'Multi-day hiking expeditions through Drakensberg Mountains.',
    category: 'Tours',
    rating: 4.8,
    reviewCount: 156,
    location: {
      address: 'Blyde River Canyon Road',
      city: 'Graskop',
      province: 'Mpumalanga',
      coordinates: { lat: -24.5593, lng: 30.8476 }
    },
    contact: {
      phone: '+27 13 767 1988',
      email: 'bookings@mpumalangahiking.co.za',
      website: 'https://mpumalangahiking.co.za'
    },
    hours: {
      Monday: '6:00 AM - 7:00 PM',
      Tuesday: '6:00 AM - 7:00 PM',
      Wednesday: '6:00 AM - 7:00 PM',
      Thursday: '6:00 AM - 7:00 PM',
      Friday: '6:00 AM - 7:00 PM',
      Saturday: '6:00 AM - 8:00 PM',
      Sunday: '6:00 AM - 8:00 PM'
    },
    amenities: ['Camping Sites', 'Mountain Huts', 'Water Points', 'Toilets', 'Emergency Services', 'Trail Maps', 'Parking', 'Wildlife Viewing Areas', 'Waterfall Access'],
    services: [
      {
        id: 's9-1',
        name: 'Day Hike - Lisbon Falls',
        description: 'Moderate 12km round-trip hike to the spectacular 94m Lisbon Falls.',
        price: 450,
        duration: '5-6 hours',
        category: 'Hiking'
      },
      {
        id: 's9-2',
        name: 'Blyde River Canyon Trek',
        description: 'Full-day guided trek along the third largest canyon in the world.',
        price: 895,
        duration: '8 hours',
        category: 'Hiking'
      },
      {
        id: 's9-3',
        name: '3-Day Panorama Route',
        description: 'Multi-day camping trek covering God\'s Window, Pinnacle Rock, and multiple waterfalls.',
        price: 3200,
        duration: '3 days / 2 nights',
        category: 'Trekking'
      },
      {
        id: 's9-4',
        name: 'Waterfall Photography Tour',
        description: 'Guided photography tour to 5 major waterfalls with professional tips.',
        price: 650,
        duration: '4 hours',
        category: 'Photography'
      }
    ],
    gallery: [
      'https://via.placeholder.com/800x600/00ACC1/FFFFFF?text=Blyde+Canyon',
      'https://via.placeholder.com/800x600/F4511E/FFFFFF?text=Lisbon+Falls',
      'https://via.placeholder.com/800x600/6D4C41/FFFFFF?text=Mountain+Trek'
    ]
  },
  '10': {
    id: '10',
    name: 'Johannesburg Arts District',
    description: 'Gallery tours, street art, and cultural performances.',
    category: 'Attractions',
    rating: 4.5,
    reviewCount: 278,
    location: {
      address: '286 Fox Street, Maboneng',
      city: 'Johannesburg',
      province: 'Gauteng',
      coordinates: { lat: -26.2041, lng: 28.0473 }
    },
    contact: {
      phone: '+27 11 492 5765',
      email: 'info@joburgartsdistrict.co.za',
      website: 'https://joburgartsdistrict.co.za'
    },
    hours: {
      Monday: '10:00 AM - 6:00 PM',
      Tuesday: '10:00 AM - 6:00 PM',
      Wednesday: '10:00 AM - 6:00 PM',
      Thursday: '10:00 AM - 8:00 PM',
      Friday: '10:00 AM - 9:00 PM',
      Saturday: '10:00 AM - 9:00 PM',
      Sunday: '10:00 AM - 6:00 PM'
    },
    amenities: ['Galleries', 'Cafes', 'Street Art', 'Performance Spaces', 'Workshops', 'Parking', 'WiFi', 'Gift Shops', 'Food Market'],
    services: [
      {
        id: 's10-1',
        name: 'Street Art Walking Tour',
        description: 'Guided 2-hour walk through Maboneng discovering murals and urban art.',
        price: 280,
        duration: '2 hours',
        category: 'Walking Tour'
      },
      {
        id: 's10-2',
        name: 'Gallery Hop Experience',
        description: 'Visit 5 contemporary art galleries with expert commentary and artist meet-and-greets.',
        price: 350,
        duration: '3 hours',
        category: 'Art Tour'
      },
      {
        id: 's10-3',
        name: 'Cultural Performance Evening',
        description: 'Live music, dance, and theater showcasing South African talent, includes dinner.',
        price: 520,
        duration: '3 hours',
        category: 'Performance'
      },
      {
        id: 's10-4',
        name: 'Art Workshop',
        description: 'Hands-on painting or sculpture class with local artists, materials included.',
        price: 450,
        duration: '2.5 hours',
        category: 'Workshop'
      },
      {
        id: 's10-5',
        name: 'Full Day Arts Experience',
        description: 'Walking tour, gallery visits, lunch, workshop, and evening performance.',
        price: 1450,
        duration: '8 hours',
        category: 'Combo'
      }
    ],
    gallery: [
      'https://via.placeholder.com/800x600/E91E63/FFFFFF?text=Street+Art',
      'https://via.placeholder.com/800x600/9C27B0/FFFFFF?text=Gallery',
      'https://via.placeholder.com/800x600/FF5722/FFFFFF?text=Performance'
    ]
  }
};

// Add attraction businesses to the main businesses object
import { attractionBusinesses } from './attractionBusinesses'

// Merge attraction businesses into the main object
attractionBusinesses.forEach(business => {
  extendedMockBusinesses[business.id] = business
})
