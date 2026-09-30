const { test } = require("node:test");
const assert = require("node:assert/strict");
const { signature, verifyNotification } = require("../services/payfast");
const passphrase = "test-passphrase";
function request(changes = {}) {
  const data = {
    merchant_id: "100",
    m_payment_id: "booking-1",
    pf_payment_id: "pf-1",
    payment_status: "COMPLETE",
    amount_gross: "250.00",
    ...changes,
  };
  data.signature = signature(data, passphrase);
  return data;
}
const defaults = {
  remote: "::ffff:127.0.0.1",
  payment: { amount: "250.00" },
  merchantId: "100",
  passphrase,
  allowedAddresses: ["127.0.0.1"],
  validate: async () => true,
};
test("notification requires signature, source, merchant, amount and provider validation", async () => {
  assert.equal(
    await verifyNotification({ ...defaults, data: request() }),
    true,
  );
  await assert.rejects(
    verifyNotification({
      ...defaults,
      data: { ...request(), amount_gross: "1.00" },
    }),
    /signature/,
  );
  await assert.rejects(
    verifyNotification({ ...defaults, data: request(), remote: "192.0.2.1" }),
    /source/,
  );
  await assert.rejects(
    verifyNotification({
      ...defaults,
      data: request({ merchant_id: "other" }),
    }),
    /Merchant/,
  );
  await assert.rejects(
    verifyNotification({
      ...defaults,
      data: request({ amount_gross: "1.00" }),
    }),
    /data/,
  );
  await assert.rejects(
    verifyNotification({
      ...defaults,
      data: request(),
      validate: async () => false,
    }),
    /validation/,
  );
});
test("valid pending notifications never confirm a payment", async () => {
  assert.equal(
    await verifyNotification({
      ...defaults,
      data: request({ payment_status: "PENDING" }),
    }),
    false,
  );
});
