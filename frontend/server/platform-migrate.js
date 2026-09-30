const { query } = require("./db");
async function migratePlatform() {
  await query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 0;
    CREATE TABLE IF NOT EXISTS listings (
      id TEXT PRIMARY KEY, owner_id TEXT REFERENCES users(id), data JSONB NOT NULL,
      status TEXT NOT NULL DEFAULT 'published', updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS favourites (
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE, listing_id TEXT REFERENCES listings(id) ON DELETE CASCADE,
      PRIMARY KEY(user_id, listing_id)
    );
    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), data JSONB NOT NULL,
      share_token TEXT UNIQUE, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS trip_votes (
      trip_id TEXT REFERENCES trips(id) ON DELETE CASCADE, user_id TEXT REFERENCES users(id), listing_id TEXT REFERENCES listings(id),
      PRIMARY KEY(trip_id, user_id, listing_id)
    );
    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), listing_id TEXT NOT NULL REFERENCES listings(id),
      data JSONB NOT NULL, status TEXT NOT NULL DEFAULT 'requested', response TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS listing_events (
      id BIGSERIAL PRIMARY KEY, listing_id TEXT REFERENCES listings(id), event TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id), listing_id TEXT REFERENCES listings(id),
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5), text TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(user_id, listing_id)
    );
    CREATE TABLE IF NOT EXISTS listing_claims (
      id TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id), listing_id TEXT REFERENCES listings(id),
      evidence TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(user_id, listing_id)
    );
    CREATE INDEX IF NOT EXISTS enquiries_user_idx ON enquiries(user_id);
    CREATE INDEX IF NOT EXISTS listings_owner_idx ON listings(owner_id);
    CREATE INDEX IF NOT EXISTS trips_user_idx ON trips(user_id);
    ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS quoted_amount NUMERIC(12,2);
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY, enquiry_id TEXT UNIQUE REFERENCES enquiries(id),user_id TEXT REFERENCES users(id),
      amount NUMERIC(12,2) NOT NULL CHECK(amount>0),status TEXT NOT NULL,provider_id TEXT UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS refund_requests (
      id TEXT PRIMARY KEY,payment_id TEXT UNIQUE REFERENCES payments(id),reason TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'requested',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS payment_receipts (
      provider_id TEXT PRIMARY KEY,payment_id TEXT NOT NULL REFERENCES payments(id),amount NUMERIC(12,2) NOT NULL,received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  for (const item of require("./data/listings.json")) {
    await query(
      "INSERT INTO listings(id,data) VALUES($1,$2) ON CONFLICT(id) DO NOTHING",
      [item.id, item],
    );
    await query(
      `UPDATE listings SET data=data || $2::jsonb WHERE id=$1 AND owner_id IS NULL AND data->>'sample'='true'`,
      [
        item.id,
        JSON.stringify({
          imageUrl: item.imageUrl,
          gallery: item.gallery,
          photoCredit: item.photoCredit,
        }),
      ],
    );
  }
}
module.exports = { migratePlatform };
