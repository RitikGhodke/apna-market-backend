// const express = require('express');
// const router = express.Router();
// const {
//   addProduct,
//   getMyProducts,
//   getShopProducts,
//   updateProduct,
//   deleteProduct,
//   toggleProduct
// } = require('../controllers/product.controller');
// const isLoggedIn = require('../middlewares/auth.middleware');
// const isShopOwner = require('../middlewares/shopOwner.middleware');

// // Shop owner routes
// router.post('/add', isLoggedIn, isShopOwner, addProduct);
// router.get('/my-products', isLoggedIn, isShopOwner, getMyProducts);
// router.put('/:id', isLoggedIn, isShopOwner, updateProduct);
// router.delete('/:id', isLoggedIn, isShopOwner, deleteProduct);
// router.put('/:id/toggle', isLoggedIn, isShopOwner, toggleProduct);

// // Public routes
// router.get('/shop/:shopId', getShopProducts);

// module.exports = router;







const express = require('express');
const router = express.Router();
const {
  addProduct,
  getMyProducts,
  getShopProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleProduct,
  setFeaturedProducts,
  getFeaturedByShop
} = require('../controllers/product.controller');
const isLoggedIn = require('../middlewares/auth.middleware');
const isShopOwner = require('../middlewares/shopOwner.middleware');

// ── Shop Owner Routes ──
router.post('/add',           isLoggedIn, isShopOwner, addProduct);
router.get('/my-products',    isLoggedIn, isShopOwner, getMyProducts);
router.put('/featured',       isLoggedIn, isShopOwner, setFeaturedProducts);  // NEW
router.put('/:id',            isLoggedIn, isShopOwner, updateProduct);
router.delete('/:id',         isLoggedIn, isShopOwner, deleteProduct);
router.put('/:id/toggle',     isLoggedIn, isShopOwner, toggleProduct);

// ── Public Routes ──
router.get('/shop/:shopId',           getShopProducts);
router.get('/featured/:shopId',       getFeaturedByShop);   // NEW
router.get('/:id',                    getProductById);       // NEW — Amazon style detail

module.exports = router;