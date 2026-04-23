const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cart.controller');
const isLoggedIn = require('../middlewares/auth.middleware');

router.post('/add', isLoggedIn, addToCart);
router.get('/', isLoggedIn, getCart);
router.put('/update', isLoggedIn, updateCartItem);
router.delete('/remove/:productId', isLoggedIn, removeFromCart);
router.delete('/clear', isLoggedIn, clearCart);

module.exports = router;