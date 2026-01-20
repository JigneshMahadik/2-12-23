const express = require('express');

const router = express.Router();
const cartController = require('../controllers/cartController');

// Cart routes
router.put('/addToCart', cartController.addToCart);
router.get('/getCart', cartController.getCart);
router.post('/applyCoupon', cartController.applyCoupon);


module.exports = router;