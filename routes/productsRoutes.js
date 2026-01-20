const express = require('express');

const router = express.Router();
const productsController = require('../controllers/productsController');

// Products routes
router.post('/products', productsController.addProduct);
router.get('/products', productsController.productsListing);

module.exports = router;