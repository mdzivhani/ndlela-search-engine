const express = require('express');
const router = express.Router();

// Operator dashboard endpoints (skeleton)
router.get('/dashboard', async (req, res) => {
  // return sample operator dashboard data
  return res.json({ bookings: [], payouts: [], profile: { name: 'Sample Operator' } });
});

module.exports = router;
