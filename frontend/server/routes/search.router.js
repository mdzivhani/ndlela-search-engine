const express = require('express');
const router = express.Router();

// Mock data for development
const mockSearchResults = [
  {
    id: '1',
    name: 'Kruger Game Lodge',
    description: 'Luxury safari lodge offering guided game drives and accommodation.',
    category: 'Accommodation',
    rating: 4.8,
    city: 'Skukuza',
    province: 'Mpumalanga',
    latitude: -24.985,
    longitude: 31.601,
    priceFrom: 3200,
    priceTo: 5200
  },
  {
    id: '2',
    name: 'Table Mountain Tours',
    description: 'Guided hiking and cable car tours with stunning views.',
    category: 'Tours',
    rating: 4.9,
    city: 'Cape Town',
    province: 'Western Cape',
    latitude: -33.962,
    longitude: 18.409,
    priceFrom: 850,
    priceTo: 1500
  },
  {
    id: '3',
    name: 'Cape Town Spa & Wellness',
    description: 'Full-service spa with traditional African treatments.',
    category: 'Wellness',
    rating: 4.7,
    city: 'Cape Town',
    province: 'Western Cape',
    latitude: -33.9289,
    longitude: 18.4174,
    priceFrom: 1200,
    priceTo: 2400
  },
  {
    id: '4',
    name: 'Winelands Wine Tasting',
    description: 'Premium wine tasting experiences in Stellenbosch.',
    category: 'Food & Drink',
    rating: 4.6,
    city: 'Stellenbosch',
    province: 'Western Cape',
    latitude: -33.938,
    longitude: 18.86,
    priceFrom: 600,
    priceTo: 1800
  },
  {
    id: '5',
    name: 'Garden Route Adventure Park',
    description: 'Outdoor activities including zip-lining, hiking, and rock climbing.',
    category: 'Activities',
    rating: 4.5,
    city: 'George',
    province: 'Western Cape',
    latitude: -33.958,
    longitude: 22.459,
    priceFrom: 450,
    priceTo: 1200
  },
  {
    id: '6',
    name: 'East London Beach Resort',
    description: 'Beachfront resort with water sports and entertainment.',
    category: 'Accommodation',
    rating: 4.4,
    city: 'East London',
    province: 'Eastern Cape',
    latitude: -33.015,
    longitude: 27.911,
    priceFrom: 1800,
    priceTo: 3200
  },
  {
    id: '7',
    name: 'Durban Aquarium & Museum',
    description: 'Interactive aquarium and cultural museum experiences.',
    category: 'Attractions',
    rating: 4.6,
    city: 'Durban',
    province: 'KwaZulu-Natal',
    latitude: -29.8587,
    longitude: 31.0218,
    priceFrom: 250,
    priceTo: 600
  },
  {
    id: '8',
    name: 'Knysna Oyster Farm Tour',
    description: 'Oyster farming demonstrations and seafood restaurants.',
    category: 'Food & Drink',
    rating: 4.7,
    city: 'Knysna',
    province: 'Western Cape',
    latitude: -34.034,
    longitude: 23.046,
    priceFrom: 700,
    priceTo: 1600
  },
  {
    id: '9',
    name: 'Mpumalanga Hiking Trail',
    description: 'Multi-day hiking expeditions through Drakensberg Mountains.',
    category: 'Tours',
    rating: 4.8,
    city: 'Graskop',
    province: 'Mpumalanga',
    latitude: -24.989,
    longitude: 30.846,
    priceFrom: 950,
    priceTo: 2100
  },
  {
    id: '10',
    name: 'Johannesburg Arts District',
    description: 'Gallery tours, street art, and cultural performances.',
    category: 'Attractions',
    rating: 4.5,
    city: 'Johannesburg',
    province: 'Gauteng',
    latitude: -26.2041,
    longitude: 28.0473,
    priceFrom: 300,
    priceTo: 900
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

// Search endpoint - now public (no auth required)
router.get('/', async (req, res) => {
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

// Search by category endpoint - now public (no auth required)
router.get('/category', async (req, res) => {
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
