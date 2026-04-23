// const express = require('express');
// const router = express.Router();
// const {
//   toggleFavourite,
//   getMyFavourites,
//   getProfile,
//   updateProfile
// } = require('../controllers/user.controller');
// const isLoggedIn = require('../middlewares/auth.middleware');

// router.get('/profile', isLoggedIn, getProfile);
// router.put('/profile', isLoggedIn, updateProfile);
// router.post('/favourite/:shopId', isLoggedIn, toggleFavourite);
// router.get('/favourites', isLoggedIn, getMyFavourites);

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const {
//   updateProfilePicture,  // ✅ naya add kiya
//   toggleFavourite,
//   getMyFavourites,
//   getProfile,
//   updateProfile
// } = require('../controllers/user.controller');
// const isLoggedIn = require('../middlewares/auth.middleware');

// const upload = multer({ dest: 'uploads/' });  // ✅ multer setup

// router.get('/profile', isLoggedIn, getProfile);
// router.put('/profile', isLoggedIn, updateProfile);
// // router.put('/update-dp', isLoggedIn, upload.single('profilePic'), updateProfilePicture);  
// router.put('/update-dp', isLoggedIn, upload.single('dp'), updateProfilePicture);
// router.post('/favourite/:shopId', isLoggedIn, toggleFavourite);
// router.get('/favourites', isLoggedIn, getMyFavourites);

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const {
//   updateProfilePicture,
//   toggleFavourite,
//   getMyFavourites,
//   getProfile,
//   updateProfile
  
// } = require('../controllers/user.controller');
// const isLoggedIn = require('../middlewares/auth.middleware');

// // ✅ memoryStorage — disk pe save nahi hoga, buffer milega
// const upload = multer({ storage: multer.memoryStorage() });

// router.get('/profile', isLoggedIn, getProfile);
// router.put('/profile', isLoggedIn, updateProfile);
// router.put('/update-dp', isLoggedIn, upload.single('profilePic'), updateProfilePicture); // ✅ 'profilePic' fix
// router.post('/favourite/:shopId', isLoggedIn, toggleFavourite);
// router.get('/favourites', isLoggedIn, getMyFavourites);


// module.exports = router;





const express = require('express');
const router = express.Router();

const {
  updateProfilePicture,
  toggleFavourite,
  getMyFavourites,
  getProfile,
  updateProfile,
  updateAddress,       // ✅ naya
} = require('../controllers/user.controller');
const isLoggedIn = require('../middlewares/auth.middleware');

// ✅ memoryStorage — disk pe save nahi hoga, buffer milega


router.get('/profile', isLoggedIn, getProfile);
router.put('/profile', isLoggedIn, updateProfile);
// YE KARO
router.put('/update-dp', isLoggedIn, updateProfilePicture);
router.put('/update-address', isLoggedIn, updateAddress);   // ✅ naya
router.post('/favourite/:shopId', isLoggedIn, toggleFavourite);
router.get('/favourites', isLoggedIn, getMyFavourites);

module.exports = router;