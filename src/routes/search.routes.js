const express = require('express');
const router = express.Router();
const {
  searchShops,
  searchProducts,
  getNearbyShops
} = require('../controllers/search.controller');

router.get('/shops', searchShops);
router.get('/products', searchProducts);
router.get('/nearby', getNearbyShops);

module.exports = router;