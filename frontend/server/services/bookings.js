const { randomUUID } = require("crypto");
// Only call after all PayFast notification checks pass. The row lock makes retries idempotent.
async function recordPayment(pool, paymentId, providerId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      "SELECT * FROM payments WHERE id=$1 FOR UPDATE",
      [paymentId],
    );
    const payment = result.rows[0];
    if (!payment) throw new Error("Unknown payment");
    const receipt = await client.query(
      "INSERT INTO payment_receipts(provider_id,payment_id,amount) VALUES($1,$2,$3) ON CONFLICT(provider_id) DO NOTHING RETURNING provider_id",
      [providerId, paymentId, payment.amount],
    );
    if (!receipt.rowCount) {
      const prior = await client.query(
        "SELECT payment_id FROM payment_receipts WHERE provider_id=$1",
        [providerId],
      );
      if (prior.rows[0].payment_id !== paymentId)
        throw new Error(
          "Provider payment is already associated with a different booking",
        );
      await client.query("COMMIT");
      return;
    }
    if (payment.status === "paid") {
      if (payment.provider_id !== providerId)
        await client.query(
          `INSERT INTO refund_requests(id,payment_id,reason) VALUES($1,$2,$3) ON CONFLICT(payment_id) DO UPDATE SET reason=refund_requests.reason || E'\n' || EXCLUDED.reason,status='requested'`,
          [
            randomUUID(),
            paymentId,
            `Additional payment received (${providerId}). Review this duplicate charge for a refund.`,
          ],
        );
    } else {
      await client.query(
        "UPDATE payments SET status='paid',provider_id=$2,updated_at=NOW() WHERE id=$1",
        [paymentId, providerId],
      );
      const enquiry = await client.query(
        "UPDATE enquiries SET status=CASE WHEN status IN ('cancelled','unavailable') THEN 'refund_requested' WHEN status='completed' THEN 'completed' ELSE 'confirmed' END,updated_at=NOW() WHERE id=$1 RETURNING status",
        [payment.enquiry_id],
      );
      if (enquiry.rows[0]?.status === "refund_requested")
        await client.query(
          "INSERT INTO refund_requests(id,payment_id,reason) VALUES($1,$2,$3) ON CONFLICT(payment_id) DO NOTHING",
          [
            randomUUID(),
            paymentId,
            "Payment received after cancellation. Review the charge for a refund.",
          ],
        );
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
module.exports = { recordPayment };
