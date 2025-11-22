const express = require('express');
const router = express.Router();

// Mock data for development with location, amenities, and activities
const mockSearchResults = [
  {
    id: '1',
    name: 'Kruger Game Lodge',
    description: 'Luxury safari lodge offering guided game drives and accommodation.',
    category: 'Accommodation',
    rating: 4.8,
    location: {
      lat: -24.0046,
      lng: 31.4954,
      address: 'Kruger National Park',
      city: 'Skukuza',
      province: 'Mpumalanga'
    },
    amenities: ['Free WiFi', 'Swimming Pool', 'Restaurant', 'Bar', 'Parking', 'Air Conditioning', '24/7 Reception'],
    activities: ['Game Drives', 'Bush Walks', 'Bird Watching', 'Photography Tours', 'Star Gazing']
  },
  {
    id: '2',
    name: 'Table Mountain Tours',
    description: 'Guided hiking and cable car tours with stunning views.',
    category: 'Tours',
    rating: 4.9,
    location: {
      lat: -33.9628,
      lng: 18.4098,
      address: 'Table Mountain Aerial Cableway',
      city: 'Cape Town',
      province: 'Western Cape'
    },
    amenities: ['Guided Tours', 'Cable Car Access', 'Viewing Platforms', 'Souvenir Shop', 'Café'],
    activities: ['Hiking', 'Cable Car Rides', 'Photography', 'Rock Climbing', 'Abseiling']
  },
  {
    id: '3',
    name: 'Cape Town Spa & Wellness',
    description: 'Full-service spa with traditional African treatments.',
    category: 'Wellness',
    rating: 4.7,
    location: {
      lat: -33.9249,
      lng: 18.4241,
      address: '45 Kloof Street',
      city: 'Cape Town',
      province: 'Western Cape'
    },
    amenities: ['Sauna', 'Steam Room', 'Jacuzzi', 'Massage Rooms', 'Beauty Salon', 'Parking', 'Free WiFi'],
    activities: ['Massage Therapy', 'Facial Treatments', 'Body Wraps', 'Yoga Classes', 'Meditation']
  },
  {
    id: '4',
    name: 'Winelands Wine Tasting',
    description: 'Premium wine tasting experiences in Stellenbosch.',
    category: 'Food & Drink',
    rating: 4.6,
    location: {
      lat: -33.9321,
      lng: 18.8602,
      address: 'R44 Wine Route',
      city: 'Stellenbosch',
      province: 'Western Cape'
    },
    amenities: ['Tasting Room', 'Restaurant', 'Gift Shop', 'Parking', 'Outdoor Seating', 'Cellar Tours'],
    activities: ['Wine Tasting', 'Cellar Tours', 'Food Pairing', 'Vineyard Walks', 'Wine Blending']
  },
  {
    id: '5',
    name: 'Garden Route Adventure Park',
    description: 'Outdoor activities including zip-lining, hiking, and rock climbing.',
    category: 'Activities',
    rating: 4.5,
    location: {
      lat: -34.0376,
      lng: 23.0453,
      address: 'N2 Highway',
      city: 'Wilderness',
      province: 'Western Cape'
    },
    amenities: ['Lockers', 'Safety Equipment', 'Parking', 'Picnic Areas', 'First Aid Station', 'Café'],
    activities: ['Zip-lining', 'Hiking', 'Rock Climbing', 'Abseiling', 'Mountain Biking', 'Canoeing']
  },
  {
    id: '6',
    name: 'East London Beach Resort',
    description: 'Beachfront resort with water sports and entertainment.',
    category: 'Accommodation',
    rating: 4.4,
    location: {
      lat: -33.0153,
      lng: 27.9116,
      address: 'Esplanade',
      city: 'East London',
      province: 'Eastern Cape'
    },
    amenities: ['Beach Access', 'Swimming Pool', 'Restaurant', 'Bar', 'Gym', 'Spa', 'Free WiFi', 'Parking'],
    activities: ['Surfing', 'Swimming', 'Beach Volleyball', 'Kayaking', 'Fishing', 'Sunset Cruises']
  },
  {
    id: '7',
    name: 'Durban Aquarium & Museum',
    description: 'Interactive aquarium and cultural museum experiences.',
    category: 'Attractions',
    rating: 4.6,
    location: {
      lat: -29.8587,
      lng: 31.0218,
      address: '1 King Shaka Parade',
      city: 'Durban',
      province: 'KwaZulu-Natal'
    },
    amenities: ['Gift Shop', 'Café', 'Parking', 'Wheelchair Access', 'Audio Guides', 'Restrooms'],
    activities: ['Aquarium Tours', 'Shark Feeding Shows', 'Touch Pools', 'Educational Programs', 'Photography']
  },
  {
    id: '8',
    name: 'Knysna Oyster Farm Tour',
    description: 'Oyster farming demonstrations and seafood restaurants.',
    category: 'Food & Drink',
    rating: 4.7,
    location: {
      lat: -34.0364,
      lng: 23.0471,
      address: 'Thesen Island',
      city: 'Knysna',
      province: 'Western Cape'
    },
    amenities: ['Restaurant', 'Outdoor Seating', 'Parking', 'Gift Shop', 'Boat Access'],
    activities: ['Oyster Tasting', 'Farm Tours', 'Boat Trips', 'Seafood Dining', 'Photography']
  },
  {
    id: '9',
    name: 'Mpumalanga Hiking Trail',
    description: 'Multi-day hiking expeditions through Drakensberg Mountains.',
    category: 'Tours',
    rating: 4.8,
    location: {
      lat: -25.0664,
      lng: 30.9770,
      address: 'Blyde River Canyon',
      city: 'Graskop',
      province: 'Mpumalanga'
    },
    amenities: ['Trail Maps', 'Camping Sites', 'Water Points', 'Emergency Shelters', 'Parking'],
    activities: ['Hiking', 'Camping', 'Bird Watching', 'Photography', 'Waterfall Viewing', 'Rock Climbing']
  },
  {
    id: '10',
    name: 'Johannesburg Arts District',
    description: 'Gallery tours, street art, and cultural performances.',
    category: 'Attractions',
    rating: 4.5,
    location: {
      lat: -26.2041,
      lng: 28.0473,
      address: 'Main Street, Maboneng',
      city: 'Johannesburg',
      province: 'Gauteng'
    },
    amenities: ['Art Galleries', 'Cafés', 'Street Parking', 'Public Transport Access', 'Restrooms'],
    activities: ['Gallery Tours', 'Street Art Tours', 'Live Performances', 'Shopping', 'Dining', 'Photography']
  }
];

// Verify token middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization required' });
  }
  next();
}

// Search endpoint
router.get('/', verifyToken, async (req, res) => {
  try {
    const q = (req.query.q || '').toLowerCase();
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    let results = mockSearchResults;

    // Filter by query
    if (q) {
      results = results.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    // Apply pagination
    const total = results.length;
    results = results.slice(offset, offset + limit);

    return res.json({
      query: q || '*',
      total,
      results
    });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ message: 'Search failed' });
  }
});

// Search by category endpoint
router.get('/category', verifyToken, async (req, res) => {
  try {
    const category = (req.query.category || '').toLowerCase();
    const limit = parseInt(req.query.limit) || 10;

    if (!category) {
      return res.status(400).json({ message: 'Category parameter required' });
    }

    let results = mockSearchResults.filter(
      (item) => item.category.toLowerCase().includes(category)
    );

    results = results.slice(0, limit);

    return res.json({
      query: category,
      total: results.length,
      results
    });
  } catch (error) {
    console.error('Category search error:', error);
    return res.status(500).json({ message: 'Category search failed' });
  }
});

module.exports = router;
