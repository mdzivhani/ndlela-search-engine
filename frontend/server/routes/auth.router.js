const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Simple in-memory user store for development (replace with database)
const users = new Map();

// Multer storage configuration for avatars
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, '..', 'uploads', 'avatars');
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // Extract user id from token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const tokenParts = token.split('-');
    const userId = tokenParts[tokenParts.length - 1];
    cb(null, userId + path.extname(file.originalname).toLowerCase());
  }
});

const upload = multer({
  storage: avatarStorage,
  limits: { fileSize: 1_000_000 }, // 1MB
  fileFilter: (req, file, cb) => {
    if (!['image/png', 'image/jpeg'].includes(file.mimetype)) {
      return cb(new Error('Unsupported file type. Use JPG or PNG.'));
    }
    cb(null, true);
  }
});

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
        name: user.name,
        profilePicture: user.profilePicture || null
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
        name,
        profilePicture: null
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
          name: user.name,
          profilePicture: user.profilePicture || null
        });
      }
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ message: 'Failed to get user' });
  }
});

// Upload avatar endpoint
router.post('/avatar', verifyToken, (req, res, next) => {
  upload.single('avatar')(req, res, function (err) {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      const tokenParts = token.split('-');
      const userId = tokenParts[tokenParts.length - 1];
      let targetUser = null;
      for (const user of users.values()) {
        if (user.id === userId) {
          targetUser = user;
          break;
        }
      }
      if (!targetUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const fileRelPath = `/uploads/avatars/${req.file.filename}`;
      targetUser.profilePicture = fileRelPath;
      return res.json({ success: true, url: fileRelPath });
    } catch (e) {
      console.error('Avatar upload error:', e);
      return res.status(500).json({ success: false, message: 'Avatar upload failed' });
    }
  });
});

// Remove avatar endpoint
router.delete('/avatar', verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const tokenParts = token.split('-');
    const userId = tokenParts[tokenParts.length - 1];
    let targetUser = null;
    for (const user of users.values()) {
      if (user.id === userId) {
        targetUser = user;
        break;
      }
    }
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (targetUser.profilePicture) {
      const filePath = path.join(__dirname, '..', 'uploads', 'avatars', path.basename(targetUser.profilePicture));
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { console.warn('Failed to delete avatar file', e); }
      }
    }
    targetUser.profilePicture = undefined;
    return res.json({ success: true });
  } catch (e) {
    console.error('Avatar remove error:', e);
    return res.status(500).json({ success: false, message: 'Avatar remove failed' });
  }
});


module.exports = router;
