const express = require('express');
const router = express.Router();

const {
  uploadShopLogo,
  uploadShopBanner,
  uploadProductImage
} = require('../controllers/upload.controller');
const isLoggedIn = require('../middlewares/auth.middleware');
const isShopOwner = require('../middlewares/shopOwner.middleware');

router.post('/shop-logo', isLoggedIn, isShopOwner, uploadShopLogo);
router.post('/shop-banner', isLoggedIn, isShopOwner, uploadShopBanner);
router.post('/product-image/:productId', isLoggedIn, isShopOwner, uploadProductImage);

module.exports = router;