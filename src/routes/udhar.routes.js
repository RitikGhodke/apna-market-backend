// const express = require('express');
// const router = express.Router();
// const {
//   addUdhar,
//   addPayment,
//   getUdharList,
//   getCustomerUdhar
// } = require('../controllers/udhar.controller');
// const isLoggedIn = require('../middlewares/auth.middleware');
// const isShopOwner = require('../middlewares/shopOwner.middleware');

// router.post('/add-udhar', isLoggedIn, isShopOwner, addUdhar);
// router.post('/add-payment', isLoggedIn, isShopOwner, addPayment);
// router.get('/list', isLoggedIn, isShopOwner, getUdharList);
// router.get('/customer/:customerId', isLoggedIn, isShopOwner, getCustomerUdhar);

// module.exports = router;










const express = require('express');
const router = express.Router();
const {
  getUdharList,
  getMyUdhar,
  customerPayUdhar,
  remindCustomer,
  addPayment,
  getCustomerUdhar
} = require('../controllers/udhar.controller');
const isLoggedIn = require('../middlewares/auth.middleware');
const isShopOwner = require('../middlewares/shopOwner.middleware');

// ─── Customer Routes ───────────────────────────
// Customer apna udhar dekhe
router.get('/my-udhar', isLoggedIn, getMyUdhar);

// Customer payment kare
router.post('/pay', isLoggedIn, customerPayUdhar);

// ─── Shop Owner Routes ─────────────────────────
// Saara udhar list
router.get('/list', isLoggedIn, isShopOwner, getUdharList);

// Manually payment record karo (cash payment etc)
router.post('/add-payment', isLoggedIn, isShopOwner, addPayment);

// Ek customer ka detail
router.get('/customer/:customerId', isLoggedIn, isShopOwner, getCustomerUdhar);

// Customer ko reminder bhejo
router.post('/remind/:customerId', isLoggedIn, isShopOwner, remindCustomer);

module.exports = router;