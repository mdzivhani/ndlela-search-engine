const express = require('express');
const router = express.Router();

// Mock data for development
const mockSearchResults = [
  {
    id: '1',
    name: 'Kruger Game Lodge',
    description: 'Luxury safari lodge offering guided game drives and accommodation.',
    category: 'Accommodation',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Table Mountain Tours',
    description: 'Guided hiking and cable car tours with stunning views.',
    category: 'Tours',
    rating: 4.9
  },
  {
    id: '3',
    name: 'Cape Town Spa & Wellness',
    description: 'Full-service spa with traditional African treatments.',
    category: 'Wellness',
    rating: 4.7
  },
  {
    id: '4',
    name: 'Winelands Wine Tasting',
    description: 'Premium wine tasting experiences in Stellenbosch.',
    category: 'Food & Drink',
    rating: 4.6
  },
  {
    id: '5',
    name: 'Garden Route Adventure Park',
    description: 'Outdoor activities including zip-lining, hiking, and rock climbing.',
    category: 'Activities',
    rating: 4.5
  },
  {
    id: '6',
    name: 'East London Beach Resort',
    description: 'Beachfront resort with water sports and entertainment.',
    category: 'Accommodation',
    rating: 4.4
  },
  {
    id: '7',
    name: 'Durban Aquarium & Museum',
    description: 'Interactive aquarium and cultural museum experiences.',
    category: 'Attractions',
    rating: 4.6
  },
  {
    id: '8',
    name: 'Knysna Oyster Farm Tour',
    description: 'Oyster farming demonstrations and seafood restaurants.',
    category: 'Food & Drink',
    rating: 4.7
  },
  {
    id: '9',
    name: 'Mpumalanga Hiking Trail',
    description: 'Multi-day hiking expeditions through Drakensberg Mountains.',
    category: 'Tours',
    rating: 4.8
  },
  {
    id: '10',
    name: 'Johannesburg Arts District',
    description: 'Gallery tours, street art, and cultural performances.',
    category: 'Attractions',
    rating: 4.5
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
