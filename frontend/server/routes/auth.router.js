const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY || 'change-me-dev-secret';
const TOKEN_EXPIRY = process.env.JWT_EXPIRATION || '7d';

// Multer storage configuration for avatars
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const userId = (req.user && req.user.id) || 'unknown';
      const dest = path.join(__dirname, '..', 'uploads', 'avatars', userId);
      fs.mkdirSync(dest, { recursive: true });
      cb(null, dest);
    } catch (e) {
      cb(e);
    }
  },
  filename: (req, file, cb) => {
    try {
      cb(null, 'avatar' + path.extname(file.originalname).toLowerCase());
    } catch (e) {
      cb(e);
    }
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
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email, name: decoded.name };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const result = await query('SELECT id, email, password_hash, name, profile_picture FROM users WHERE email=$1', [email]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Email not registered. Please register to continue.' , code: 'EMAIL_NOT_REGISTERED' });
    }
    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' , code: 'WRONG_PASSWORD' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profilePicture: user.profile_picture || null
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

    const exists = await query('SELECT 1 FROM users WHERE email=$1', [email]);
    if (exists.rowCount > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const userId = `user-${Date.now()}`;
    const passwordHash = await bcrypt.hash(password, 10);
    await query(
      'INSERT INTO users (id, email, password_hash, name) VALUES ($1, $2, $3, $4)',
      [userId, email, passwordHash, name]
    );

    const token = jwt.sign({ id: userId, email, name }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
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
    const userId = req.user.id;
    const result = await query('SELECT id, email, name, profile_picture FROM users WHERE id=$1', [userId]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'User not found' });
    const user = result.rows[0];
    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      profilePicture: user.profile_picture || null
    });

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
      const userId = req.user.id;
      const fileRelPath = `/uploads/avatars/${userId}/${req.file.filename}`;
      query('UPDATE users SET profile_picture=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2', [fileRelPath, userId])
        .catch((e) => console.warn('Failed to update profile picture', e));
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
    const userId = req.user.id;
    const result = await query('SELECT profile_picture FROM users WHERE id=$1', [userId]);
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'User not found' });
    const current = result.rows[0].profile_picture;
    if (current) {
      const filePath = path.join(__dirname, '..', current);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { console.warn('Failed to delete avatar file', e); }
      }
    }
    await query('UPDATE users SET profile_picture=NULL, updated_at=CURRENT_TIMESTAMP WHERE id=$1', [userId]);
    return res.json({ success: true });
  } catch (e) {
    console.error('Avatar remove error:', e);
    return res.status(500).json({ success: false, message: 'Avatar remove failed' });
  }
});


module.exports = router;
