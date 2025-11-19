const express = require('express');
const router = express.Router();

// Simple in-memory user store for development (replace with database)
const users = new Map();

// Validate token middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Simple token validation (just check format for dev)
  if (!token.startsWith('dev-token-')) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  next();
}

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = users.get(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = `dev-token-${Date.now()}-${user.id}`;
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Login failed' });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name required' });
    }

    if (users.has(email)) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const userId = `user-${Date.now()}`;
    users.set(email, {
      id: userId,
      email,
      password,
      name
    });

    const token = `dev-token-${Date.now()}-${userId}`;
    return res.status(201).json({
      token,
      user: {
        id: userId,
        email,
        name
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Registration failed' });
  }
});

// Get current user endpoint
router.get('/me', verifyToken, async (req, res) => {
  try {
    // Extract user ID from token (dev-token-timestamp-userid)
    const tokenParts = req.headers['authorization'].split(' ')[1].split('-');
    const userId = tokenParts[tokenParts.length - 1];

    // Find user by ID
    for (const user of users.values()) {
      if (user.id === userId) {
        return res.json({
          id: user.id,
          email: user.email,
          name: user.name
        });
      }
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ message: 'Failed to get user' });
  }
});

module.exports = router;
