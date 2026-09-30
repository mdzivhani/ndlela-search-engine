// Per-process guard for the local deployment; use a shared store when scaling replicas.
function rateLimit({ max = 30, windowMs = 15 * 60 * 1000 } = {}) {
  const buckets = new Map();
  let lastSweep = Date.now();
  return (req, res, next) => {
    const now = Date.now();
    if (now - lastSweep > windowMs) {
      for (const [key, value] of buckets)
        if (value.until < now) buckets.delete(key);
      lastSweep = now;
    }
    const key = req.ip,
      old = buckets.get(key);
    const entry =
      old && old.until > now ? old : { count: 0, until: now + windowMs };
    entry.count++;
    buckets.set(key, entry);
    if (entry.count > max) {
      res.set("Retry-After", String(Math.ceil((entry.until - now) / 1000)));
      return res
        .status(429)
        .json({ message: "Too many attempts. Please try again later." });
    }
    next();
  };
}
module.exports = { rateLimit };
