const express = require('express');
const router = express.Router();
const {
  getOverview,
  getSubscriptions,
  blockSubscription,
  getShops,
  toggleShop,
  getUsers
} = require('../controllers/admin.controller');
const isLoggedIn = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/auth.middleware');

router.get('/overview', isLoggedIn, isAdmin, getOverview);
router.get('/subscriptions', isLoggedIn, isAdmin, getSubscriptions);
router.put('/subscription/:id/block', isLoggedIn, isAdmin, blockSubscription);
router.get('/shops', isLoggedIn, isAdmin, getShops);
router.put('/shop/:id/toggle', isLoggedIn, isAdmin, toggleShop);
router.get('/users', isLoggedIn, isAdmin, getUsers);

module.exports = router;