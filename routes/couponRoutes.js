const express = require('express');

const router = express.Router();
const couponController = require('../controllers/couponController');

// Coupons routes
router.post('/coupons', couponController.addCoupon);

module.exports = router;