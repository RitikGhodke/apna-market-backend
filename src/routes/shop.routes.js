// const express = require('express');
// const router = express.Router();
// const {
//   getShopBySlug,
//   getAnalytics,
//   updateShop,
//    uploadLogo,
//   uploadBanner,
//   updateDeliverySettings,
//   updateHomePage,
//   getCustomers
 
// } = require('../controllers/shop.controller');
// const isLoggedIn = require('../middlewares/auth.middleware');
// const isShopOwner = require('../middlewares/shopOwner.middleware');


// // Public routes
// router.get('/:slug', getShopBySlug);

// // Shop owner routes
// router.get('/dashboard/analytics', isLoggedIn, isShopOwner, getAnalytics);
// router.get('/dashboard/customers', isLoggedIn, isShopOwner, getCustomers);
// router.put('/update', isLoggedIn, isShopOwner, updateShop);
// router.put('/delivery-settings', isLoggedIn, isShopOwner, updateDeliverySettings);
// router.put('/homepage', isLoggedIn, isShopOwner, updateHomePage);
// router.put('/upload-logo', protect, isShopOwner, uploadLogo);
// router.put('/upload-banner', protect, isShopOwner, uploadBanner);

// module.exports = router;




const express = require('express');
const router = express.Router();

const {
  getShopBySlug,
  getAnalytics,
  updateShop,
  uploadLogo,
  uploadBanner,
   uploadBannerUrl,
  updateDeliverySettings,
  updateHomePage,
  getCustomers
} = require('../controllers/shop.controller');

const isLoggedIn = require('../middlewares/auth.middleware');
const isShopOwner = require('../middlewares/shopOwner.middleware');

// Public routes
router.get('/:slug', getShopBySlug);

// Shop owner routes
router.get('/dashboard/analytics', isLoggedIn, isShopOwner, getAnalytics);
router.get('/dashboard/customers', isLoggedIn, isShopOwner, getCustomers);
router.put('/update', isLoggedIn, isShopOwner, updateShop);
router.put('/delivery-settings', isLoggedIn, isShopOwner, updateDeliverySettings);
router.put('/homepage', isLoggedIn, isShopOwner, updateHomePage);

// ✅ FIXED
router.put('/upload-logo', isLoggedIn, isShopOwner, uploadLogo);
router.put('/upload-banner', isLoggedIn, isShopOwner, uploadBanner);
router.put('/upload-banner-url',  isLoggedIn, isShopOwner, uploadBannerUrl);

module.exports = router;