const router = require("express").Router();
const { query, pool } = require("../db");
const { requireUser, wrap } = require("../auth");
router.use(requireUser, (req, res, next) => {
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
  if (!admins.includes(req.user.email.toLowerCase()))
    return res
      .status(403)
      .json({ message: "Administrator access is required" });
  next();
});
router.get(
  "/",
  wrap(async (req, res) => {
    const reviews = await query(
      "SELECT r.*,u.name,l.data->>'name' listing_name FROM reviews r JOIN users u ON r.user_id=u.id JOIN listings l ON l.id=r.listing_id WHERE r.status='pending'",
    );
    const claims = await query(
      "SELECT c.*,u.name,u.email,l.data->>'name' listing_name FROM listing_claims c JOIN users u ON c.user_id=u.id JOIN listings l ON l.id=c.listing_id WHERE c.status='pending'",
    );
    const refunds = await query(
      "SELECT r.*,p.amount,p.provider_id,u.email FROM refund_requests r JOIN payments p ON p.id=r.payment_id JOIN users u ON u.id=p.user_id WHERE r.status='requested'",
    );
    res.json({
      reviews: reviews.rows,
      claims: claims.rows,
      refunds: refunds.rows,
    });
  }),
);
router.patch(
  "/reviews/:id",
  wrap(async (req, res) => {
    if (!["approved", "rejected"].includes(req.body.status))
      return res.status(400).json({ message: "Invalid moderation decision" });
    await query("UPDATE reviews SET status=$2 WHERE id=$1", [
      req.params.id,
      req.body.status,
    ]);
    res.json({ success: true });
  }),
);
router.patch(
  "/claims/:id",
  wrap(async (req, res) => {
    if (!["approved", "rejected"].includes(req.body.status))
      return res.status(400).json({ message: "Invalid decision" });
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const r = await client.query(
        "SELECT * FROM listing_claims WHERE id=$1 AND status='pending' FOR UPDATE",
        [req.params.id],
      );
      if (!r.rowCount) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Pending claim not found" });
      }
      if (req.body.status === "approved") {
        const assigned = await client.query(
          "UPDATE listings SET owner_id=$2,data=jsonb_set(data,'{verified}','true'),updated_at=NOW() WHERE id=$1 AND (owner_id IS NULL OR owner_id=$2) RETURNING id",
          [r.rows[0].listing_id, r.rows[0].user_id],
        );
        if (!assigned.rowCount) {
          await client.query("ROLLBACK");
          return res
            .status(409)
            .json({ message: "Listing already has another owner" });
        }
      }
      await client.query("UPDATE listing_claims SET status=$2 WHERE id=$1", [
        req.params.id,
        req.body.status,
      ]);
      await client.query("COMMIT");
      res.json({ success: true });
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }),
);
module.exports = router;
