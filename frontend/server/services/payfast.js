const { createHash, timingSafeEqual } = require("crypto");
const encode = (value) =>
  encodeURIComponent(String(value).trim())
    .replace(
      /[!'()*]/g,
      (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase(),
    )
    .replace(/%20/g, "+");
function parameterString(data) {
  return Object.entries(data)
    .filter(
      ([key, value]) =>
        key !== "signature" && value !== "" && value !== undefined,
    )
    .map(([key, value]) => `${key}=${encode(value)}`)
    .join("&");
}
function signature(data, passphrase) {
  return createHash("md5")
    .update(
      parameterString(data) +
        (passphrase ? "&passphrase=" + encode(passphrase) : ""),
    )
    .digest("hex");
}
function validSignature(data, passphrase) {
  const actual = String(data.signature || "");
  return (
    /^[a-f0-9]{32}$/i.test(actual) &&
    timingSafeEqual(
      Buffer.from(actual.toLowerCase()),
      Buffer.from(signature(data, passphrase)),
    )
  );
}
async function verifyNotification({
  data,
  remote,
  payment,
  merchantId,
  passphrase,
  allowedAddresses,
  validate,
}) {
  const reject = (message) => {
    throw Object.assign(new Error(message), { status: 400 });
  };
  if (
    !Object.values(data).every((v) => typeof v === "string") ||
    !validSignature(data, passphrase)
  )
    reject("Invalid notification signature");
  if (data.merchant_id !== merchantId) reject("Merchant mismatch");
  if (!allowedAddresses.includes(remote.replace(/^::ffff:/, "")))
    reject("Invalid payment notification source");
  if (
    !payment ||
    !data.pf_payment_id ||
    !/^\d+\.\d{2}$/.test(data.amount_gross || "") ||
    Number(data.amount_gross) !== Number(payment.amount)
  )
    reject("Payment data does not match");
  if (!(await validate(parameterString(data))))
    reject("Payment validation failed");
  return data.payment_status === "COMPLETE";
}
module.exports = {
  parameterString,
  signature,
  validSignature,
  verifyNotification,
};
