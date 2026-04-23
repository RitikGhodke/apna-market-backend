const express = require('express');
const router = express.Router();
const { register, login, createShop, getMe,forgotPassword,
  resetPassword } = require('../controllers/auth.controller');
const isLoggedIn = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/create-shop', isLoggedIn, createShop);
router.get('/me', isLoggedIn, getMe);

module.exports = router;