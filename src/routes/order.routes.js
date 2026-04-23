const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getShopOrders,
  updateOrderStatus,
  getOrderById,
  cancelOrder
} = require('../controllers/order.controller');
const isLoggedIn = require('../middlewares/auth.middleware');
const isShopOwner = require('../middlewares/shopOwner.middleware');

// Customer routes
router.post('/place', isLoggedIn, placeOrder);
router.get('/my-orders', isLoggedIn, getMyOrders);
router.put('/:id/cancel', isLoggedIn, cancelOrder);

// Shop owner routes
router.get('/shop-orders', isLoggedIn, isShopOwner, getShopOrders);
router.put('/:id/status', isLoggedIn, isShopOwner, updateOrderStatus);

// Common
router.get('/:id', isLoggedIn, getOrderById);

module.exports = router;