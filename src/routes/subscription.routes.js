// const express = require('express');
// const router = express.Router();
// const {
//   getSubscriptionStatus,
//   checkSubscription
// } = require('../controllers/subscription.controller');
// const isLoggedIn = require('../middlewares/auth.middleware');
// const isShopOwner = require('../middlewares/shopOwner.middleware');

// router.get('/status', isLoggedIn, isShopOwner, getSubscriptionStatus);
// router.post('/check', isLoggedIn, isShopOwner, checkSubscription);

// module.exports = router;








const express = require('express');
const router = express.Router();
const { getSubscriptionStatus, submitPayment } = require('../controllers/subscription.controller');
const isLoggedIn = require('../middlewares/auth.middleware');
const isShopOwner = require('../middlewares/shopOwner.middleware');

router.get('/status', isLoggedIn, isShopOwner, getSubscriptionStatus);
router.post('/submit-payment', isLoggedIn, isShopOwner, submitPayment);

module.exports = router;