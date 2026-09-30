const jwt = require("jsonwebtoken");
const { query } = require("./db");
async function requireUser(req, res, next) {
  try {
    const token = (req.headers.authorization || "").match(/^Bearer (.+)$/)?.[1];
    if (!token)
      return res.status(401).json({ message: "Please sign in to continue" });
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || process.env.JWT_SECRET_KEY,
      { algorithms: ["HS256"] },
    );
    if (decoded.type === "reset")
      return res.status(401).json({ message: "An access token is required" });
    const result = await query(
      "SELECT id, email, name, token_version FROM users WHERE id=$1",
      [decoded.id],
    );
    if (!result.rowCount)
      return res.status(401).json({ message: "Account not found" });
    req.user = result.rows[0];
    if ((decoded.version || 0) !== req.user.token_version)
      return res
        .status(401)
        .json({ message: "Your password changed. Please sign in again." });
    next();
  } catch (_) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
const wrap = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);
module.exports = { requireUser, wrap };
