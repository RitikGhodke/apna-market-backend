const express = require('express');
const router = express.Router();
const {
  createAd,
  getMyAds,
  getFeaturedShops
} = require('../controllers/ad.controller');
const isLoggedIn = require('../middlewares/auth.middleware');
const isShopOwner = require('../middlewares/shopOwner.middleware');

router.post('/create', isLoggedIn, isShopOwner, createAd);
router.get('/my-ads', isLoggedIn, isShopOwner, getMyAds);
router.get('/featured', getFeaturedShops);

module.exports = router;