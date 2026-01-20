const express = require('express');

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  return res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

module.exports = router;