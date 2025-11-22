const express = require('express');
const router = express.Router();

// Configuration for backend Search API
const SEARCH_API_URL = process.env.SEARCH_API_URL || 'http://localhost:5003';

// Verify token middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization required' });
  }
  next();
}

// Search endpoint - proxies to backend Search API
router.get('/', verifyToken, async (req, res) => {
  try {
    const q = req.query.q || '';
    const region = req.query.region || '';
    const minStars = req.query.minStars || '';
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    // Build query params for Search API
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (region) params.set('region', region);
    if (minStars) params.set('minStars', minStars);

    // Call backend Search API
    const response = await fetch(`${SEARCH_API_URL}/api/search?${params.toString()}`);
    
    if (!response.ok) {
      console.error('Search API error:', response.status, response.statusText);
      return res.status(response.status).json({ message: 'Search API error' });
    }

    const businesses = await response.json();

    // Transform backend response to frontend format
    const results = (businesses || []).map(b => ({
      id: b.id,
      name: b.name,
      description: b.description || '',
      category: b.type || 'General',
      rating: (b.starRating || 0) / 1.0  // Convert to decimal if needed
    }));

    // Apply pagination on frontend
    const total = results.length;
    const paginatedResults = results.slice(offset, offset + limit);

    return res.json({
      query: q || '*',
      total,
      results: paginatedResults
    });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ message: 'Search failed', error: error.message });
  }
});

// Search by category endpoint - uses type filter
router.get('/category', verifyToken, async (req, res) => {
  try {
    const category = req.query.category || '';
    const limit = parseInt(req.query.limit) || 10;

    if (!category) {
      return res.status(400).json({ message: 'Category parameter required' });
    }

    // Call backend Search API with category as query
    const response = await fetch(`${SEARCH_API_URL}/api/search?q=${encodeURIComponent(category)}`);
    
    if (!response.ok) {
      console.error('Category search API error:', response.status, response.statusText);
      return res.status(response.status).json({ message: 'Category search API error' });
    }

    const businesses = await response.json();

    // Transform and filter by category/type
    const results = (businesses || [])
      .filter(b => (b.type || '').toLowerCase().includes(category.toLowerCase()))
      .map(b => ({
        id: b.id,
        name: b.name,
        description: b.description || '',
        category: b.type || 'General',
        rating: (b.starRating || 0) / 1.0
      }))
      .slice(0, limit);

    return res.json({
      query: category,
      total: results.length,
      results
    });
  } catch (error) {
    console.error('Category search error:', error);
    return res.status(500).json({ message: 'Category search failed', error: error.message });
  }
});

module.exports = router;
