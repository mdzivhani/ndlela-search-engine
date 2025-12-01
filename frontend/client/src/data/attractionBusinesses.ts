/**
 * Additional Mock Businesses for Tourist Attractions
 * These businesses are linked to the tourist attractions
 */

import { ExtendedBusiness } from './extendedMockBusinesses'

export const attractionBusinesses: ExtendedBusiness[] = [
  {
    id: '9001',
    name: 'Cape Cableway Adventures',
    description: 'Experience breathtaking views of Cape Town from Table Mountain. Our cable car rotates 360 degrees during the ascent, ensuring every passenger gets unobstructed views of the city, harbour, and peninsula.',
    category: 'Sightseeing',
    rating: 4.8,
    reviewCount: 2450,
    location: {
      address: 'Tafelberg Road',
      city: 'Cape Town',
      province: 'Western Cape',
      coordinates: { lat: -33.9628, lng: 18.4010 }
    },
    contact: {
      phone: '+27 21 424 8181',
      email: 'info@tablemountain.net',
      website: 'https://www.tablemountain.net'
    },
    services: [
      {
        id: 's9001-1',
        name: 'Standard Cable Car Ticket',
        description: 'Return trip to the summit with rotating cable car experience.',
        price: 395,
        duration: '30 mins',
        category: 'Cable Car'
      },
      {
        id: 's9001-2',
        name: 'Sunset Cable Car Ride',
        description: 'Evening cable car ride with stunning sunset views and complimentary refreshment.',
        price: 450,
        duration: '45 mins',
        category: 'Cable Car'
      }
    ],
    amenities: ['Restaurant', 'Gift Shop', 'Free Wi-Fi', 'Wheelchair Accessible', 'Parking'],
    gallery: ['https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80'],
    hours: {
      monday: '8:00 AM - 6:00 PM',
      tuesday: '8:00 AM - 6:00 PM',
      wednesday: '8:00 AM - 6:00 PM',
      thursday: '8:00 AM - 6:00 PM',
      friday: '8:00 AM - 6:00 PM',
      saturday: '8:00 AM - 7:00 PM',
      sunday: '8:00 AM - 7:00 PM'
    }
  },
  {
    id: '9002',
    name: 'V&A Waterfront Experience',
    description: 'South Africa\'s most visited destination offering world-class shopping, dining, and entertainment in a working harbour.',
    category: 'Shopping & Dining',
    rating: 4.7,
    reviewCount: 3890,
    location: {
      address: 'V&A Waterfront',
      city: 'Cape Town',
      province: 'Western Cape',
      coordinates: { lat: -33.9025, lng: 18.4192 }
    },
    contact: {
      phone: '+27 21 408 7600',
      email: 'info@waterfront.co.za',
      website: 'https://www.waterfront.co.za'
    },
    services: [
      {
        id: 's9002-1',
        name: 'Harbour Boat Tour',
        description: 'Scenic boat tour around the working harbour with seal sightings.',
        price: 180,
        duration: '1 hour',
        category: 'Boat Tour'
      },
      {
        id: 's9002-2',
        name: 'Aquarium Visit',
        description: 'Two Oceans Aquarium featuring diverse marine life.',
        price: 250,
        duration: '2-3 hours',
        category: 'Attraction'
      }
    ],
    amenities: ['Shopping', 'Restaurants', 'Free Wi-Fi', 'Parking', 'ATMs', 'Entertainment'],
    gallery: ['https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80'],
    hours: {
      monday: '9:00 AM - 9:00 PM',
      tuesday: '9:00 AM - 9:00 PM',
      wednesday: '9:00 AM - 9:00 PM',
      thursday: '9:00 AM - 9:00 PM',
      friday: '9:00 AM - 9:00 PM',
      saturday: '9:00 AM - 9:00 PM',
      sunday: '9:00 AM - 9:00 PM'
    }
  },
  {
    id: '9003',
    name: 'Robben Island Museum',
    description: 'UNESCO World Heritage Site where Nelson Mandela was imprisoned for 18 years. Tour includes ferry ride and guided tour by former political prisoners.',
    category: 'Historical Tour',
    rating: 4.6,
    reviewCount: 1980,
    location: {
      address: 'Nelson Mandela Gateway, Clock Tower Precinct, V&A Waterfront',
      city: 'Cape Town',
      province: 'Western Cape',
      coordinates: { lat: -33.9073, lng: 18.4237 }
    },
    contact: {
      phone: '+27 21 413 4200',
      email: 'info@robben-island.org.za',
      website: 'https://www.robben-island.org.za'
    },
    services: [
      {
        id: 's9003-1',
        name: 'Standard Island Tour',
        description: 'Ferry ride, bus tour of the island, and visit to Nelson Mandela\'s cell.',
        price: 620,
        duration: '3.5 hours',
        category: 'Historical Tour'
      }
    ],
    amenities: ['Museum', 'Gift Shop', 'Guided Tours', 'Café'],
    gallery: ['https://images.unsplash.com/photo-1536152470836-b943b246224c?w=800&q=80'],
    hours: {
      monday: '9:00 AM - 3:00 PM',
      tuesday: '9:00 AM - 3:00 PM',
      wednesday: '9:00 AM - 3:00 PM',
      thursday: '9:00 AM - 3:00 PM',
      friday: '9:00 AM - 3:00 PM',
      saturday: '9:00 AM - 3:00 PM',
      sunday: '9:00 AM - 3:00 PM'
    }
  },
  {
    id: '9004',
    name: 'Kruger Safari Tours',
    description: 'Authentic Big 5 safari experiences in Kruger National Park. Expert guides, comfortable vehicles, and unforgettable wildlife encounters.',
    category: 'Wildlife Safari',
    rating: 4.9,
    reviewCount: 1560,
    location: {
      address: 'Kruger Gate',
      city: 'Skukuza',
      province: 'Mpumalanga',
      coordinates: { lat: -25.0089, lng: 31.5483 }
    },
    contact: {
      phone: '+27 13 735 4000',
      email: 'info@krugersafaris.co.za',
      website: 'https://www.krugersafaris.co.za'
    },
    services: [
      {
        id: 's9004-1',
        name: 'Morning Game Drive',
        description: 'Early morning drive to spot lions, elephants, and other wildlife.',
        price: 650,
        duration: '3 hours',
        category: 'Game Drive'
      },
      {
        id: 's9004-2',
        name: 'Full Day Safari',
        description: 'All-day safari with breakfast, lunch, and multiple game viewing stops.',
        price: 2400,
        duration: 'Full day',
        category: 'Game Drive'
      }
    ],
    amenities: ['4x4 Vehicles', 'Expert Guides', 'Meals Included', 'Binoculars Provided', 'Photography Opportunities'],
    gallery: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80'],
    hours: {
      monday: '5:00 AM - 6:00 PM',
      tuesday: '5:00 AM - 6:00 PM',
      wednesday: '5:00 AM - 6:00 PM',
      thursday: '5:00 AM - 6:00 PM',
      friday: '5:00 AM - 6:00 PM',
      saturday: '5:00 AM - 6:00 PM',
      sunday: '5:00 AM - 6:00 PM'
    }
  },
  {
    id: '9005',
    name: 'Blyde Canyon Adventures',
    description: 'Explore the third largest canyon in the world with breathtaking viewpoints, boat cruises, and nature walks.',
    category: 'Nature & Adventure',
    rating: 4.7,
    reviewCount: 890,
    location: {
      address: 'Blyde River Canyon Nature Reserve',
      city: 'Hoedspruit',
      province: 'Mpumalanga',
      coordinates: { lat: -24.5553, lng: 30.8170 }
    },
    contact: {
      phone: '+27 15 795 5141',
      email: 'info@blydecanyon.co.za',
      website: 'https://www.blydecanyon.co.za'
    },
    services: [
      {
        id: 's9005-1',
        name: 'Scenic Viewpoints Tour',
        description: 'Visit God\'s Window, Three Rondavels, and Bourke\'s Luck Potholes.',
        price: 380,
        duration: '4 hours',
        category: 'Sightseeing'
      },
      {
        id: 's9005-2',
        name: 'Canyon Boat Cruise',
        description: 'Relaxing boat cruise on the Blyde Dam with stunning canyon views.',
        price: 280,
        duration: '1.5 hours',
        category: 'Boat Cruise'
      }
    ],
    amenities: ['Viewpoints', 'Boat Rides', 'Hiking Trails', 'Picnic Areas', 'Parking'],
    gallery: ['https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80'],
    hours: {
      monday: '8:00 AM - 5:00 PM',
      tuesday: '8:00 AM - 5:00 PM',
      wednesday: '8:00 AM - 5:00 PM',
      thursday: '8:00 AM - 5:00 PM',
      friday: '8:00 AM - 5:00 PM',
      saturday: '8:00 AM - 5:00 PM',
      sunday: '8:00 AM - 5:00 PM'
    }
  },
  {
    id: '9006',
    name: 'Gold Reef City Theme Park Tours',
    description: 'Johannesburg\'s premier entertainment destination with thrilling rides, a casino, and a recreated gold rush era mining town.',
    category: 'Theme Park',
    rating: 4.5,
    reviewCount: 2340,
    location: {
      address: 'Northern Parkway and Data Crescent, Ormonde',
      city: 'Johannesburg',
      province: 'Gauteng',
      coordinates: { lat: -26.2353, lng: 27.9856 }
    },
    contact: {
      phone: '+27 11 248 6800',
      email: 'info@goldreefcity.co.za',
      website: 'https://www.goldreefcity.co.za'
    },
    services: [
      {
        id: 's9006-1',
        name: 'Theme Park Ticket',
        description: 'Full day access to all rides and attractions.',
        price: 299,
        duration: 'Full day',
        category: 'Theme Park'
      },
      {
        id: 's9006-2',
        name: 'VIP Fast Track',
        description: 'Skip the queues with priority access to all rides.',
        price: 650,
        duration: 'Full day',
        category: 'Theme Park'
      }
    ],
    amenities: ['Rides', 'Casino', 'Restaurants', 'Gift Shops', 'Parking', 'ATMs'],
    gallery: ['https://images.unsplash.com/photo-1594818379496-da1e345b0ded?w=800&q=80'],
    hours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '9:00 AM - 6:00 PM',
      sunday: '9:00 AM - 6:00 PM'
    }
  },
  {
    id: '9007',
    name: 'Lion and Safari Park',
    description: 'Interactive wildlife experience just 45 minutes from Johannesburg. Get up close with lions, cheetahs, and other African wildlife.',
    category: 'Wildlife Park',
    rating: 4.6,
    reviewCount: 1450,
    location: {
      address: 'R114 Pelindaba Road',
      city: 'Lanseria',
      province: 'Gauteng',
      coordinates: { lat: -25.9363, lng: 27.9167 }
    },
    contact: {
      phone: '+27 11 691 9905',
      email: 'info@lionandsafaripark.com',
      website: 'https://www.lionandsafaripark.com'
    },
    services: [
      {
        id: 's9007-1',
        name: 'Self-Drive Safari',
        description: 'Drive through the park in your own vehicle to see lions, cheetahs, and antelope.',
        price: 280,
        duration: '2 hours',
        category: 'Wildlife Drive'
      },
      {
        id: 's9007-2',
        name: 'Guided Lion Tour',
        description: 'Guided tour with expert commentary and close encounters with lions.',
        price: 480,
        duration: '2.5 hours',
        category: 'Wildlife Tour'
      }
    ],
    amenities: ['Self-Drive', 'Guided Tours', 'Restaurant', 'Curio Shop', 'Picnic Areas', 'Parking'],
    gallery: ['https://images.unsplash.com/photo-1535338454770-a8bdb3d6eb56?w=800&q=80'],
    hours: {
      monday: '8:30 AM - 5:00 PM',
      tuesday: '8:30 AM - 5:00 PM',
      wednesday: '8:30 AM - 5:00 PM',
      thursday: '8:30 AM - 5:00 PM',
      friday: '8:30 AM - 5:00 PM',
      saturday: '8:30 AM - 5:00 PM',
      sunday: '8:30 AM - 5:00 PM'
    }
  }
]
