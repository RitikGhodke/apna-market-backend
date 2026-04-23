const express = require('express');
const router = express.Router();
const {
  createPaymentOrder,
  verifyPayment,
  createSubscriptionPayment,
  verifySubscriptionPayment,
   createUpiOrder,
   confirmUpiPayment,
   verifyUpiByOwner   
} = require('../controllers/payment.controller');
const isLoggedIn = require('../middlewares/auth.middleware');
const isShopOwner = require('../middlewares/shopOwner.middleware');

// Customer payment
router.post('/create-order', isLoggedIn, createPaymentOrder);
router.post('/verify', isLoggedIn, verifyPayment);
router.post('/upi-order', isLoggedIn, createUpiOrder);
router.post('/upi-confirm', isLoggedIn, confirmUpiPayment);
router.put('/upi-verify/:orderId', isLoggedIn, isShopOwner, verifyUpiByOwner);
// Subscription payment
router.post('/subscription', isLoggedIn, isShopOwner, createSubscriptionPayment);
router.post('/verify-subscription', isLoggedIn, isShopOwner, verifySubscriptionPayment);

module.exports = router;