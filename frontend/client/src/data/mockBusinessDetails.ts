export interface BusinessDetail {
  id: string;
  name: string;
  type: string;
  description: string;
  rating: number;
  reviewCount: number;
  location: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  hours: {
    [key: string]: string;
  };
  amenities: string[];
  services: Array<{
    name: string;
    description: string;
    price: string;
    duration?: string;
  }>;
  gallery: string[];
}

export const mockBusinessDetails: { [key: string]: BusinessDetail } = {
  '1': {
    id: '1',
    name: 'Table Mountain Tours',
    type: 'Tours',
    description: 'Experience breathtaking guided hiking and cable car tours with stunning panoramic views of Cape Town, Table Bay, and the Atlantic Ocean. Our expert guides will take you through indigenous fynbos vegetation and share fascinating stories about the mountain\'s rich history and unique biodiversity.',
    rating: 4.9,
    reviewCount: 1247,
    location: {
      address: 'Tafelberg Road',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '8001',
      coordinates: {
        lat: -33.9628,
        lng: 18.4098
      }
    },
    contact: {
      phone: '+27 21 424 8181',
      email: 'info@tablemountaintours.co.za',
      website: 'https://tablemountaintours.co.za'
    },
    hours: {
      'Monday': '8:00 AM - 6:00 PM',
      'Tuesday': '8:00 AM - 6:00 PM',
      'Wednesday': '8:00 AM - 6:00 PM',
      'Thursday': '8:00 AM - 6:00 PM',
      'Friday': '8:00 AM - 6:00 PM',
      'Saturday': '7:00 AM - 7:00 PM',
      'Sunday': '7:00 AM - 7:00 PM'
    },
    amenities: [
      'Free Parking',
      'Guided Tours',
      'Cable Car Access',
      'Restaurant on Summit',
      'Restrooms',
      'Souvenir Shop',
      'Wheelchair Accessible Cable Car',
      'First Aid Station',
      'Wi-Fi at Base Station'
    ],
    services: [
      {
        name: 'Cable Car Round Trip',
        description: 'Return cable car journey to the summit with 360-degree rotating floor',
        price: 'R395 (Adult) / R200 (Child)',
        duration: '4-5 hours'
      },
      {
        name: 'Guided Hiking Tour',
        description: 'Professional guide takes you up Platteklip Gorge route with safety equipment',
        price: 'R850 per person',
        duration: '4-6 hours'
      },
      {
        name: 'Sunset Tour',
        description: 'Evening cable car trip with sunset viewing and complimentary refreshments',
        price: 'R595 per person',
        duration: '3 hours'
      },
      {
        name: 'Photography Tour',
        description: 'Specialized tour for photographers with prime location access',
        price: 'R1,200 per person',
        duration: '5 hours'
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800',
      'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800'
    ]
  },
  '2': {
    id: '2',
    name: 'Garden Route Adventure Park',
    type: 'Activities',
    description: 'South Africa\'s premier adventure destination offering world-class outdoor activities including zip-lining through indigenous forests, rock climbing on natural cliff faces, and adrenaline-pumping adventures suitable for all skill levels. Located in the heart of the Garden Route with stunning forest and ocean views.',
    rating: 4.5,
    reviewCount: 892,
    location: {
      address: '12 Forest Drive, Tsitsikamma',
      city: 'Plettenberg Bay',
      province: 'Western Cape',
      postalCode: '6600',
      coordinates: {
        lat: -34.0259,
        lng: 23.8878
      }
    },
    contact: {
      phone: '+27 44 533 0190',
      email: 'adventures@gardenroute.co.za',
      website: 'https://gardenrouteadventures.co.za'
    },
    hours: {
      'Monday': '9:00 AM - 5:00 PM',
      'Tuesday': '9:00 AM - 5:00 PM',
      'Wednesday': '9:00 AM - 5:00 PM',
      'Thursday': '9:00 AM - 5:00 PM',
      'Friday': '9:00 AM - 5:00 PM',
      'Saturday': '8:00 AM - 6:00 PM',
      'Sunday': '8:00 AM - 6:00 PM'
    },
    amenities: [
      'Free Parking',
      'Picnic Areas',
      'Safety Equipment Provided',
      'Changing Rooms',
      'Lockers',
      'Café & Restaurant',
      'First Aid Trained Staff',
      'Indoor Waiting Area',
      'Free Wi-Fi'
    ],
    services: [
      {
        name: 'Canopy Zip-Lining',
        description: 'Soar through indigenous forest canopy on 10 zip-line platforms',
        price: 'R650 per person',
        duration: '2-3 hours'
      },
      {
        name: 'Rock Climbing Experience',
        description: 'Beginner to advanced routes with certified instructors and all equipment',
        price: 'R450 per person',
        duration: '2 hours'
      },
      {
        name: 'Abseiling Adventure',
        description: 'Descend 35m cliff face with professional guides',
        price: 'R380 per person',
        duration: '1.5 hours'
      },
      {
        name: 'Forest Hiking Trail',
        description: 'Guided nature walk through indigenous forest with wildlife spotting',
        price: 'R250 per person',
        duration: '2 hours'
      },
      {
        name: 'Full Day Adventure Package',
        description: 'Includes zip-lining, rock climbing, abseiling, and lunch',
        price: 'R1,450 per person',
        duration: '6-7 hours'
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800'
    ]
  },
  '3': {
    id: '3',
    name: 'Mpumalanga Hiking Trail',
    type: 'Tours',
    description: 'Embark on unforgettable multi-day hiking expeditions through the spectacular Drakensberg Mountains. Experience pristine wilderness, dramatic waterfalls, ancient San rock art, and diverse wildlife. Our experienced guides ensure safety while providing deep insights into the region\'s ecology, geology, and cultural heritage.',
    rating: 4.8,
    reviewCount: 634,
    location: {
      address: 'Blyde River Canyon Nature Reserve',
      city: 'Graskop',
      province: 'Mpumalanga',
      postalCode: '1270',
      coordinates: {
        lat: -24.5593,
        lng: 30.8476
      }
    },
    contact: {
      phone: '+27 13 767 1988',
      email: 'bookings@mpumalangahiking.co.za',
      website: 'https://mpumalangahiking.co.za'
    },
    hours: {
      'Monday': '7:00 AM - 5:00 PM',
      'Tuesday': '7:00 AM - 5:00 PM',
      'Wednesday': '7:00 AM - 5:00 PM',
      'Thursday': '7:00 AM - 5:00 PM',
      'Friday': '7:00 AM - 5:00 PM',
      'Saturday': '6:00 AM - 6:00 PM',
      'Sunday': '6:00 AM - 6:00 PM'
    },
    amenities: [
      'Secure Parking',
      'Mountain Huts',
      'Camping Sites',
      'Potable Water Points',
      'Emergency Shelter',
      'Professional Guides',
      'Porter Services Available',
      'Equipment Rental',
      'Transport from/to Accommodation',
      'Satellite Phone for Emergencies'
    ],
    services: [
      {
        name: '3-Day Blyde River Trail',
        description: 'Classic route through the canyon with stunning viewpoints and waterfalls',
        price: 'R3,500 per person',
        duration: '3 days, 2 nights'
      },
      {
        name: '5-Day Drakensberg Traverse',
        description: 'Extended expedition covering diverse terrain from grasslands to peaks',
        price: 'R5,800 per person',
        duration: '5 days, 4 nights'
      },
      {
        name: 'Day Hike to Lisbon Falls',
        description: 'Moderate day hike to spectacular 90m waterfall with lunch included',
        price: 'R750 per person',
        duration: '6-7 hours'
      },
      {
        name: 'Panorama Route Hike',
        description: 'Visit God\'s Window, Bourke\'s Luck Potholes, and Three Rondavels',
        price: 'R950 per person',
        duration: '8 hours'
      },
      {
        name: 'Sunrise Summit Hike',
        description: 'Early morning ascent to mountain peak for spectacular sunrise views',
        price: 'R650 per person',
        duration: '4 hours'
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'
    ]
  }
};
