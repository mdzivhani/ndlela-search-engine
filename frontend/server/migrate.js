const { query } = require('./db');

async function migrate() {
  await query(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    location VARCHAR(255),
    city VARCHAR(100),
    province VARCHAR(100),
    profile_picture TEXT,
    reset_token TEXT,
    reset_token_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);

  // Add columns if they don't exist (for existing databases)
  try {
    await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token TEXT;`);
    await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP;`);
  } catch (e) {
    console.log('Reset token columns may already exist:', e.message);
  }
}

module.exports = { migrate };
