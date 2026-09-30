const express = require("express");
const { randomUUID, randomBytes } = require("crypto");
const { query } = require("../db");
const { requireUser, wrap } = require("../auth");
const { filterListings, planTrip } = require("../services/discovery");
const router = express.Router();
function fail(message, status = 400) {
  throw Object.assign(new Error(message), { status });
}
function text(value, max = 200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function positive(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < min || n > max)
    fail("Please enter a valid number");
  return n;
}
async function listings() {
  const result =
    await query(`SELECT l.*, COALESCE(r.rating,0) rating, COALESCE(r.count,0) review_count FROM listings l
    LEFT JOIN (SELECT listing_id, AVG(rating) rating, COUNT(*) count FROM reviews WHERE status='approved' GROUP BY listing_id) r ON r.listing_id=l.id
    WHERE l.status='published'`);
  return result.rows.map((row) => ({
    ...row.data,
    id: row.id,
    updatedAt: row.updated_at,
    rating: Number(row.rating),
    reviewCount: Number(row.review_count),
    enquiryEnabled: Boolean(row.owner_id) && !row.data.sample,
  }));
}
router.get(
  "/listings",
  wrap(async (req, res) =>
    res.json(filterListings(await listings(), req.query)),
  ),
);
router.get(
  "/listings/:id",
  wrap(async (req, res) => {
    const item = (await listings()).find((l) => l.id === req.params.id);
    if (!item) fail("Listing not found", 404);
    const reviews = await query(
      `SELECT r.id,r.rating,r.text,r.created_at,u.name FROM reviews r JOIN users u ON u.id=r.user_id WHERE listing_id=$1 AND status='approved' ORDER BY created_at DESC LIMIT 50`,
      [item.id],
    );
    res.json({ ...item, reviews: reviews.rows });
  }),
);
router.post(
  "/listings/:id/events",
  wrap(async (req, res) => {
    if (!["view", "enquiry_click"].includes(req.body.event))
      fail("Invalid event");
    await query(
      "INSERT INTO listing_events(listing_id,event) SELECT id,$2 FROM listings WHERE id=$1",
      [req.params.id, req.body.event],
    );
    res.sendStatus(204);
  }),
);
router.get(
  "/favourites",
  requireUser,
  wrap(async (req, res) => {
    res.json(
      (
        await query("SELECT listing_id FROM favourites WHERE user_id=$1", [
          req.user.id,
        ])
      ).rows.map((r) => r.listing_id),
    );
  }),
);
router.put(
  "/favourites/:id",
  requireUser,
  wrap(async (req, res) => {
    const r = await query(
      "INSERT INTO favourites(user_id,listing_id) SELECT $1,id FROM listings WHERE id=$2 ON CONFLICT DO NOTHING",
      [req.user.id, req.params.id],
    );
    res.json({ success: true });
  }),
);
router.delete(
  "/favourites/:id",
  requireUser,
  wrap(async (req, res) => {
    await query("DELETE FROM favourites WHERE user_id=$1 AND listing_id=$2", [
      req.user.id,
      req.params.id,
    ]);
    res.sendStatus(204);
  }),
);
router.post(
  "/planner",
  wrap(async (req, res) => res.json(planTrip(await listings(), req.body))),
);
router.get(
  "/trips",
  requireUser,
  wrap(async (req, res) =>
    res.json(
      (
        await query(
          "SELECT id,data,share_token,updated_at FROM trips WHERE user_id=$1 ORDER BY updated_at DESC",
          [req.user.id],
        )
      ).rows,
    ),
  ),
);
function tripData(input) {
  const title = text(input.title);
  if (!title) fail("A trip name is required");
  if (!Array.isArray(input.stops) || input.stops.length > 50)
    fail("A trip can contain up to 50 stops");
  return {
    title,
    destination: text(input.destination),
    days: positive(input.days || 2, 1, 30),
    adults: positive(input.adults || 2, 1, 20),
    budget: positive(input.budget || 4000, 1, 1000000),
    notes: text(input.notes, 3000),
    warnings: Array.isArray(input.warnings)
      ? input.warnings.slice(0, 5).map((v) => text(v, 500))
      : [],
    stops: input.stops.map((s) => ({
      listingId: text(s.listingId),
      name: text(s.name),
      day: positive(s.day || 1, 1, 30),
      cost: positive(s.cost || 0, 0, 1000000),
      notes: text(s.notes, 1500),
      estimatedTravelMinutes: positive(s.estimatedTravelMinutes || 0, 0, 20000),
    })),
  };
}
router.post(
  "/trips",
  requireUser,
  wrap(async (req, res) => {
    const id = randomUUID(),
      data = tripData(req.body);
    await query("INSERT INTO trips(id,user_id,data) VALUES($1,$2,$3)", [
      id,
      req.user.id,
      data,
    ]);
    res.status(201).json({ id, data });
  }),
);
router.put(
  "/trips/:id",
  requireUser,
  wrap(async (req, res) => {
    const data = tripData(req.body);
    const r = await query(
      "UPDATE trips SET data=$3,updated_at=NOW() WHERE id=$1 AND user_id=$2 RETURNING id,data,share_token",
      [req.params.id, req.user.id, data],
    );
    if (!r.rowCount) fail("Trip not found", 404);
    res.json(r.rows[0]);
  }),
);
router.delete(
  "/trips/:id",
  requireUser,
  wrap(async (req, res) => {
    await query("DELETE FROM trips WHERE id=$1 AND user_id=$2", [
      req.params.id,
      req.user.id,
    ]);
    res.sendStatus(204);
  }),
);
router.post(
  "/trips/:id/share",
  requireUser,
  wrap(async (req, res) => {
    const r = await query(
      "UPDATE trips SET share_token=COALESCE(share_token,$3) WHERE id=$1 AND user_id=$2 RETURNING share_token",
      [req.params.id, req.user.id, randomBytes(24).toString("hex")],
    );
    if (!r.rowCount) fail("Trip not found", 404);
    res.json(r.rows[0]);
  }),
);
router.delete(
  "/trips/:id/share",
  requireUser,
  wrap(async (req, res) => {
    await query(
      "UPDATE trips SET share_token=NULL WHERE id=$1 AND user_id=$2",
      [req.params.id, req.user.id],
    );
    res.sendStatus(204);
  }),
);
router.get(
  "/shared/:token",
  wrap(async (req, res) => {
    const r = await query("SELECT id,data FROM trips WHERE share_token=$1", [
      req.params.token,
    ]);
    if (!r.rowCount) fail("This shared trip is unavailable", 404);
    const votes = await query(
      "SELECT listing_id,COUNT(*)::int count FROM trip_votes WHERE trip_id=$1 GROUP BY listing_id",
      [r.rows[0].id],
    );
    res.json({ ...r.rows[0], votes: votes.rows });
  }),
);
router.post(
  "/shared/:token/vote",
  requireUser,
  wrap(async (req, res) => {
    const r = await query("SELECT id,data FROM trips WHERE share_token=$1", [
      req.params.token,
    ]);
    if (!r.rowCount) fail("Trip not found", 404);
    if (!r.rows[0].data.stops.some((s) => s.listingId === req.body.listingId))
      fail("This stop is not in the trip");
    await query(
      "INSERT INTO trip_votes(trip_id,user_id,listing_id) VALUES($1,$2,$3) ON CONFLICT DO NOTHING",
      [r.rows[0].id, req.user.id, req.body.listingId],
    );
    res.json({ success: true });
  }),
);
router.post(
  "/enquiries",
  requireUser,
  wrap(async (req, res) => {
    const { listingId } = req.body;
    const l = await query(
      "SELECT id FROM listings WHERE id=$1 AND owner_id IS NOT NULL AND status='published' AND data->>'sample'='false'",
      [listingId],
    );
    if (!l.rowCount) fail("This listing is not accepting enquiries yet");
    const date = text(req.body.date, 10);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(Date.parse(date)) ||
      date < new Date().toISOString().slice(0, 10)
    )
      fail("Choose a valid future date");
    const data = {
      date,
      guests: positive(req.body.guests, 1, 100),
      message: text(req.body.message, 3000),
    };
    const id = randomUUID();
    await query(
      "INSERT INTO enquiries(id,user_id,listing_id,data) VALUES($1,$2,$3,$4)",
      [id, req.user.id, listingId, data],
    );
    res.status(201).json({ id, status: "requested" });
  }),
);
router.get(
  "/enquiries",
  requireUser,
  wrap(async (req, res) =>
    res.json(
      (
        await query(
          "SELECT e.*,l.data->>'name' AS listing_name FROM enquiries e JOIN listings l ON l.id=e.listing_id WHERE e.user_id=$1 ORDER BY e.created_at DESC",
          [req.user.id],
        )
      ).rows,
    ),
  ),
);
router.post(
  "/listings/:id/reviews",
  requireUser,
  wrap(async (req, res) => {
    const eligible = await query(
      "SELECT id FROM enquiries WHERE user_id=$1 AND listing_id=$2 AND status='completed'",
      [req.user.id, req.params.id],
    );
    if (!eligible.rowCount)
      fail("Reviews are available after a completed visit", 403);
    const rating = positive(req.body.rating, 1, 5),
      content = text(req.body.text, 2000);
    if (!Number.isInteger(rating) || content.length < 10)
      fail("Add a rating and at least 10 characters");
    await query(
      "INSERT INTO reviews(id,user_id,listing_id,rating,text) VALUES($1,$2,$3,$4,$5) ON CONFLICT(user_id,listing_id) DO UPDATE SET rating=$4,text=$5,status='pending'",
      [randomUUID(), req.user.id, req.params.id, rating, content],
    );
    res.status(201).json({ status: "pending" });
  }),
);
router.get(
  "/operator",
  requireUser,
  wrap(async (req, res) => {
    const owned = await query(
      `SELECT l.id,l.data,l.status,
    (SELECT COUNT(*)::int FROM listing_events e WHERE e.listing_id=l.id AND event='view') views,
    (SELECT COUNT(*)::int FROM favourites f WHERE f.listing_id=l.id) saves,
    (SELECT COUNT(*)::int FROM enquiries e WHERE e.listing_id=l.id) enquiries
    FROM listings l WHERE owner_id=$1`,
      [req.user.id],
    );
    const enquiries = await query(
      "SELECT e.*,u.name,u.email,l.data->>'name' listing_name FROM enquiries e JOIN listings l ON e.listing_id=l.id JOIN users u ON u.id=e.user_id WHERE l.owner_id=$1 ORDER BY e.created_at DESC",
      [req.user.id],
    );
    const claims = await query(
      "SELECT c.*,l.data->>'name' listing_name FROM listing_claims c JOIN listings l ON l.id=c.listing_id WHERE user_id=$1",
      [req.user.id],
    );
    res.json({
      listings: owned.rows,
      enquiries: enquiries.rows,
      claims: claims.rows,
    });
  }),
);
function listingData(body, id, previous = {}) {
  const name = text(body.name),
    city = text(body.city),
    province = text(body.province),
    description = text(body.description, 4000),
    category = text(body.category);
  if (!name || !city || !province || !description || !category)
    fail("Name, description, destination and category are required");
  const gallery = (Array.isArray(body.gallery) ? body.gallery : [])
    .slice(0, 8)
    .map((v) => text(v, 1000))
    .filter((v) => /^https:\/\//.test(v));
  const facilities = (Array.isArray(body.facilities) ? body.facilities : [])
    .slice(0, 30)
    .map((v) => text(v, 80));
  return {
    ...previous,
    id,
    name,
    city,
    province,
    description,
    category,
    latitude: positive(body.latitude, -35, -22),
    longitude: positive(body.longitude, 16, 33),
    priceFrom: positive(body.priceFrom, 0, 1000000),
    priceBasis: text(body.priceBasis) || "per person",
    gallery,
    imageUrl: gallery[0] || "",
    facilities,
    activityTypes: [category],
    hours: text(body.hours, 1500),
    accessibility: text(body.accessibility, 1500),
    transport: text(body.transport, 1500),
    languages: text(body.languages, 300),
    cancellationPolicy: text(body.cancellationPolicy, 1500),
    contact: { phone: text(body.phone, 80), email: text(body.email, 255) },
    services: Array.isArray(body.services)
      ? body.services.slice(0, 30).map((s) => ({
          id: text(s.id) || randomUUID(),
          name: text(s.name),
          description: text(s.description, 1000),
          price: positive(s.price, 0, 1000000),
          duration: text(s.duration),
          category,
        }))
      : previous.services || [],
    verified: previous.verified === true,
    sample: false,
    rating: previous.rating || 0,
    reviewCount: previous.reviewCount || 0,
  };
}
router.post(
  "/operator/listings",
  requireUser,
  wrap(async (req, res) => {
    const id = randomUUID(),
      data = listingData(req.body, id);
    await query("INSERT INTO listings(id,owner_id,data) VALUES($1,$2,$3)", [
      id,
      req.user.id,
      data,
    ]);
    res.status(201).json({ id, data });
  }),
);
router.put(
  "/operator/listings/:id",
  requireUser,
  wrap(async (req, res) => {
    const r = await query(
      "SELECT data FROM listings WHERE id=$1 AND owner_id=$2",
      [req.params.id, req.user.id],
    );
    if (!r.rowCount) fail("Listing not found", 404);
    const data = listingData(req.body, req.params.id, r.rows[0].data);
    await query(
      "UPDATE listings SET data=$3,updated_at=NOW() WHERE id=$1 AND owner_id=$2",
      [req.params.id, req.user.id, data],
    );
    res.json({ id: req.params.id, data });
  }),
);
router.patch(
  "/operator/enquiries/:id",
  requireUser,
  wrap(async (req, res) => {
    const transitions = {
      requested: ["available", "unavailable"],
      available: ["completed", "cancelled"],
      confirmed: ["completed"],
      unavailable: [],
      completed: [],
      cancelled: [],
    };
    const r = await query(
      "SELECT e.* FROM enquiries e JOIN listings l ON l.id=e.listing_id WHERE e.id=$1 AND l.owner_id=$2",
      [req.params.id, req.user.id],
    );
    if (!r.rowCount) fail("Enquiry not found", 404);
    if (!transitions[r.rows[0].status]?.includes(req.body.status))
      fail("Invalid enquiry status transition");
    if (
      req.body.status === "completed" &&
      r.rows[0].data.date > new Date().toISOString().slice(0, 10)
    )
      fail("A future visit cannot be marked completed");
    const quote =
      req.body.status === "available"
        ? positive(req.body.quote, 1, 1000000)
        : null;
    const updated = await query(
      "UPDATE enquiries SET status=$2,response=$3,quoted_amount=COALESCE($4,quoted_amount),updated_at=NOW() WHERE id=$1 AND status=$5 RETURNING id",
      [
        req.params.id,
        req.body.status,
        text(req.body.response, 3000),
        quote,
        r.rows[0].status,
      ],
    );
    if (!updated.rowCount)
      fail(
        "This enquiry changed while you were responding. Refresh and try again.",
        409,
      );
    res.json({ success: true });
  }),
);
router.post(
  "/operator/claims",
  requireUser,
  wrap(async (req, res) => {
    const evidence = text(req.body.evidence, 3000);
    if (evidence.length < 20)
      fail(
        "Please explain your connection to the business and provide evidence",
      );
    await query(
      "INSERT INTO listing_claims(id,user_id,listing_id,evidence) VALUES($1,$2,$3,$4) ON CONFLICT(user_id,listing_id) DO UPDATE SET evidence=$4,status='pending'",
      [randomUUID(), req.user.id, text(req.body.listingId), evidence],
    );
    res.status(201).json({ status: "pending" });
  }),
);
module.exports = { router, listings };
router.post(
  "/enquiries/:id/cancel",
  requireUser,
  wrap(async (req, res) => {
    const result = await query(
      "UPDATE enquiries SET status='cancelled',updated_at=NOW() WHERE id=$1 AND user_id=$2 AND status IN ('requested','available') RETURNING id",
      [req.params.id, req.user.id],
    );
    if (!result.rowCount)
      fail(
        "Only open, unpaid requests can be cancelled here. Use refund review for paid bookings.",
        409,
      );
    res.json({ status: "cancelled" });
  }),
);
