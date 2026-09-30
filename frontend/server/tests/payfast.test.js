const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  signature,
  validSignature,
  parameterString,
} = require("../services/payfast");
test("PayFast encoding preserves field order and encodes spaces like PHP", () => {
  assert.equal(
    parameterString({ merchant_id: "123", item_name: " A & B! ", empty: "" }),
    "merchant_id=123&item_name=A+%26+B%21",
  );
});
test("payment signatures reject tampering and malformed signatures", () => {
  const data = { merchant_id: "123", amount: "150.00" };
  data.signature = signature(data, "secret");
  assert.ok(validSignature(data, "secret"));
  assert.equal(validSignature({ ...data, amount: "1.00" }, "secret"), false);
  assert.equal(validSignature({ ...data, signature: "abc" }, "secret"), false);
});
