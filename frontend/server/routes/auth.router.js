const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../db');

const rawSecret = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;
if (!rawSecret) {
  throw new Error('JWT_SECRET is required. Set JWT_SECRET or JWT_SECRET_KEY environment variable.');
}
const JWT_SECRET = rawSecret;
const TOKEN_EXPIRY = process.env.JWT_EXPIRATION || '7d';

// Default profile picture path
const DEFAULT_PROFILE_PICTURE = '/uploads/default/avatar.png';

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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.mimetype)) {
      return cb(new Error('Unsupported file type. Use JPG, PNG, or WEBP.'));
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
      return res.status(400).json({ 
        message: 'Email and password required',
        code: 'VALIDATION_ERROR'
      });
    }

    const result = await query('SELECT id, email, password_hash, name, profile_picture, created_at FROM users WHERE email=$1', [email]);
    if (result.rowCount === 0) {
      return res.status(404).json({ 
        message: 'No account found with this email. Please register first.' ,
        code: 'EMAIL_NOT_REGISTERED'
      });
    }
    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ 
        message: 'Incorrect password. Please try again.' ,
        code: 'WRONG_PASSWORD'
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profilePicture: user.profile_picture || DEFAULT_PROFILE_PICTURE,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: 'Login failed. Please try again later.',
      code: 'SERVER_ERROR'
    });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: 'Email, password, and name required',
        code: 'VALIDATION_ERROR'
      });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long',
        code: 'WEAK_PASSWORD'
      });
    }

    const hasNumberOrSpecial = /[\d!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasNumberOrSpecial) {
      return res.status(400).json({ 
        message: 'Password must contain at least one number or special character',
        code: 'WEAK_PASSWORD'
      });
    }

    const exists = await query('SELECT 1 FROM users WHERE email=$1', [email]);
    if (exists.rowCount > 0) {
      return res.status(409).json({ 
        message: 'An account with this email already exists',
        code: 'EMAIL_EXISTS'
      });
    }

    const userId = `user-${Date.now()}`;
    const passwordHash = await bcrypt.hash(password, 10);
    const insertResult = await query(
      'INSERT INTO users (id, email, password_hash, name) VALUES ($1, $2, $3, $4) RETURNING created_at',
      [userId, email, passwordHash, name]
    );

    const token = jwt.sign({ id: userId, email, name }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    return res.status(201).json({
      token,
      user: {
        id: userId,
        email,
        name,
        profilePicture: DEFAULT_PROFILE_PICTURE,
        createdAt: insertResult.rows[0].created_at
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ 
      message: 'Registration failed. Please try again later.',
      code: 'SERVER_ERROR'
    });
  }
});

// Get current user endpoint
router.get('/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await query('SELECT id, email, name, phone, location, city, province, profile_picture, created_at FROM users WHERE id=$1', [userId]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'User not found' });
    const user = result.rows[0];
    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.location, // Map location to address for frontend
      city: user.city,
      province: user.province,
      profilePicture: user.profile_picture || DEFAULT_PROFILE_PICTURE,
      createdAt: user.created_at
    });

  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ message: 'Failed to get user' });
  }
});

// Update user profile endpoint
router.put('/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, city, province } = req.body;

    console.log('Profile update request:', { userId, name, phone, address, city, province });

    // Validate required field
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Update user profile (address maps to location column in DB)
    await query(
      `UPDATE users 
       SET name = $1, 
           phone = $2, 
           location = $3, 
           city = $4, 
           province = $5, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $6`,
      [name.trim(), phone || null, address || null, city || null, province || null, userId]
    );

    console.log('Profile updated successfully for user:', userId);

    // Fetch updated user data
    const result = await query('SELECT id, email, name, phone, location, city, province, profile_picture FROM users WHERE id=$1', [userId]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.location, // Map location back to address for frontend
        city: user.city,
        province: user.province,
        profilePicture: user.profile_picture || DEFAULT_PROFILE_PICTURE
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Change password endpoint
router.put('/change-password', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    console.log('Password change request for user:', userId);

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        message: 'Current password, new password, and confirmation are required' 
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'New password must be at least 6 characters long' 
      });
    }

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        message: 'New passwords do not match' 
      });
    }

    // Check if new password is same as current
    if (currentPassword === newPassword) {
      return res.status(400).json({ 
        message: 'New password must be different from current password' 
      });
    }

    // Fetch current password hash
    const result = await query('SELECT password_hash FROM users WHERE id=$1', [userId]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    
    if (!isCurrentPasswordValid) {
      console.log('Invalid current password for user:', userId);
      return res.status(401).json({ 
        message: 'Current password is incorrect',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, userId]
    );

    console.log('Password changed successfully for user:', userId);

    return res.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });

  } catch (error) {
    console.error('Password change error:', error);
    return res.status(500).json({ message: 'Failed to change password' });
  }
});

// Upload avatar endpoint
router.post('/avatar', verifyToken, (req, res) => {
  upload.single('avatar')(req, res, async function (err) {
    // Ensure all responses are JSON
    res.setHeader('Content-Type', 'application/json');
    
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ success: false, message: err.message, code: 'UPLOAD_ERROR' });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ success: false, message: 'No file uploaded', code: 'NO_FILE' });
    }
    
    try {
      const userId = req.user.id;
      const fileRelPath = `/uploads/avatars/${userId}/${req.file.filename}`;
      console.log('Avatar uploaded successfully:', fileRelPath);
      
      await query('UPDATE users SET profile_picture=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2', [fileRelPath, userId]);
      console.log('Database updated with new avatar');
      
      return res.json({ success: true, url: fileRelPath });
    } catch (e) {
      // Attempt cleanup of uploaded file if DB update fails
      try {
        const fileRelPath = `/uploads/avatars/${userId}/${req.file.filename}`;
        const absPath = path.join(__dirname, '..', fileRelPath);
        if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
      } catch (cleanupErr) {
        console.warn('Failed avatar file cleanup after DB error', cleanupErr);
      }
      console.error('Avatar upload DB update error:', e);
      return res.status(500).json({ success: false, message: 'Avatar upload failed', code: 'DB_ERROR' });
    }
  });
});

// Remove avatar endpoint
router.delete('/avatar', verifyToken, async (req, res) => {
  // Ensure JSON response
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const userId = req.user.id;
    const result = await query('SELECT profile_picture FROM users WHERE id=$1', [userId]);
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'User not found', code: 'USER_NOT_FOUND' });
    const current = result.rows[0].profile_picture;
    if (current && current !== DEFAULT_PROFILE_PICTURE) {
      const filePath = path.join(__dirname, '..', current);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { console.warn('Failed to delete avatar file', e); }
      }
    }
    // Reset to default profile picture instead of NULL
    await query('UPDATE users SET profile_picture=NULL, updated_at=CURRENT_TIMESTAMP WHERE id=$1', [userId]);
    return res.json({ success: true, profilePicture: DEFAULT_PROFILE_PICTURE });
  } catch (e) {
    console.error('Avatar remove error:', e);
    return res.status(500).json({ success: false, message: 'Avatar remove failed', code: 'REMOVE_ERROR' });
  }
});


module.exports = router;
