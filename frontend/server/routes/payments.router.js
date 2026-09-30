const router = require("express").Router();
const { randomUUID } = require("crypto");
const dns = require("dns").promises;
const { query, pool } = require("../db");
const { requireUser, wrap } = require("../auth");
const {
  signature,
  validSignature,
  parameterString,
  verifyNotification,
} = require("../services/payfast");
const fail = (message, status = 400) => {
  throw Object.assign(new Error(message), { status });
};
const host = () =>
  process.env.PAYFAST_MODE === "live"
    ? "www.payfast.co.za"
    : "sandbox.payfast.co.za";
const configured = () =>
  Boolean(
    process.env.PAYFAST_MERCHANT_ID &&
    process.env.PAYFAST_MERCHANT_KEY &&
    process.env.PAYFAST_PASSPHRASE &&
    process.env.PUBLIC_API_URL &&
    process.env.APP_URL,
  );
router.get("/config", (req, res) =>
  res.json({
    enabled: configured(),
    mode: process.env.PAYFAST_MODE === "live" ? "live" : "sandbox",
  }),
);
router.post(
  "/checkout",
  requireUser,
  wrap(async (req, res) => {
    if (!configured())
      fail(
        "Online payments are not available yet. Your enquiry remains saved.",
        503,
      );
    const r = await query(
      `SELECT e.*,l.data->>'name' listing_name FROM enquiries e JOIN listings l ON l.id=e.listing_id WHERE e.id=$1 AND e.user_id=$2`,
      [req.body.enquiryId, req.user.id],
    );
    const e = r.rows[0];
    if (!e) fail("Enquiry not found", 404);
    if (
      e.status !== "available" ||
      !e.quoted_amount ||
      Number(e.quoted_amount) <= 0
    )
      fail("The operator must confirm availability and provide a quote first");
    if (e.data.date < new Date().toISOString().slice(0, 10))
      fail("This quote is for a past date. Please request new availability.");
    const p = await query(
      `INSERT INTO payments(id,enquiry_id,user_id,amount,status) VALUES($1,$2,$3,$4,'pending') ON CONFLICT(enquiry_id) DO UPDATE SET updated_at=NOW() RETURNING *`,
      [randomUUID(), e.id, req.user.id, e.quoted_amount],
    );
    if (p.rows[0].status === "paid") fail("This booking is already paid");
    const fields = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID,
      merchant_key: process.env.PAYFAST_MERCHANT_KEY,
      return_url: new URL("/enquiries?payment=returned", process.env.APP_URL)
        .href,
      cancel_url: new URL("/enquiries?payment=cancelled", process.env.APP_URL)
        .href,
      notify_url: new URL("/api/payments/notify", process.env.PUBLIC_API_URL)
        .href,
      name_first: req.user.name.slice(0, 100),
      email_address: req.user.email,
      m_payment_id: p.rows[0].id,
      amount: Number(p.rows[0].amount).toFixed(2),
      item_name: `${e.listing_name} booking`.slice(0, 100),
    };
    fields.signature = signature(fields, process.env.PAYFAST_PASSPHRASE);
    res.json({ url: `https://${host()}/eng/process`, fields });
  }),
);
router.post(
  "/notify",
  wrap(async (req, res) => {
    if (!configured()) fail("Payments are not configured", 503);
    const data = req.body;
    if (
      !Object.values(data).every((v) => typeof v === "string") ||
      !validSignature(data, process.env.PAYFAST_PASSPHRASE)
    )
      fail("Invalid notification signature", 400);
    if (data.merchant_id !== process.env.PAYFAST_MERCHANT_ID)
      fail("Merchant mismatch");
    const validHosts =
      process.env.PAYFAST_MODE === "live"
        ? ["www.payfast.co.za", "w1w.payfast.co.za", "w2w.payfast.co.za"]
        : ["sandbox.payfast.co.za"];
    const addresses = (
      await Promise.all(
        validHosts.map((h) => dns.lookup(h, { all: true }).catch(() => [])),
      )
    )
      .flat()
      .map((v) => v.address);
    const remote = req.ip.replace(/^::ffff:/, "");
    if (!addresses.includes(remote))
      fail("Invalid payment notification source", 403);
    const payment = (
      await query("SELECT * FROM payments WHERE id=$1", [data.m_payment_id])
    ).rows[0];
    const complete = await verifyNotification({
      data,
      remote,
      payment,
      merchantId: process.env.PAYFAST_MERCHANT_ID,
      passphrase: process.env.PAYFAST_PASSPHRASE,
      allowedAddresses: addresses,
      validate: async (body) => {
        const validated = await fetch(`https://${host()}/eng/query/validate`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
          signal: AbortSignal.timeout(10000),
        });
        return validated.ok && (await validated.text()).trim() === "VALID";
      },
    });
    if (complete)
      await require("../services/bookings").recordPayment(
        pool,
        payment.id,
        data.pf_payment_id,
      );
    res.sendStatus(200);
  }),
);
router.get(
  "/",
  requireUser,
  wrap(async (req, res) =>
    res.json(
      (
        await query(
          "SELECT id,enquiry_id,amount,status,created_at FROM payments WHERE user_id=$1 ORDER BY created_at DESC",
          [req.user.id],
        )
      ).rows,
    ),
  ),
);
router.post(
  "/:id/refund-request",
  requireUser,
  wrap(async (req, res) => {
    const reason =
      typeof req.body.reason === "string"
        ? req.body.reason.trim().slice(0, 3000)
        : "";
    if (reason.length < 10) fail("Please explain the cancellation request");
    const p = (
      await query(
        "SELECT id FROM payments WHERE id=$1 AND user_id=$2 AND status='paid'",
        [req.params.id, req.user.id],
      )
    ).rows[0];
    if (!p) fail("Paid booking not found", 404);
    await query(
      "INSERT INTO refund_requests(id,payment_id,reason) VALUES($1,$2,$3) ON CONFLICT(payment_id) DO NOTHING",
      [randomUUID(), p.id, reason],
    );
    res.status(201).json({
      status: "requested",
      message:
        "Your request will be reviewed against the operator cancellation terms. No refund has been issued yet.",
    });
  }),
);
module.exports = router;
