// const User = require('../models/User');
// const Favorite = require('../models/Favorite');
// const Shop = require('../models/Shop');
// const { uploadImageToCloudinary } = require('../utils/uploadImage'); // ✅ require







// // PUT /api/user/update-dp
//  const updateProfilePicture = async (req, res) => {
//   try {
//     const userId = req.user._id; // auth middleware se aata hai

//     if (!req.file) {
//       return res.status(400).json(new ApiResponse(400, null, "Image required hai"));
//     }

//     // Cloudinary pe upload karo (tumhara uploadImage.js use)
//     const imageUrl = await uploadImageToCloudinary(req.file.path, "apna-market/users");

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { profilePicture: imageUrl },
//       { new: true }
//     ).select("-password");

//     return res.status(200).json(
//       new ApiResponse(200, { user: updatedUser }, "Profile picture update ho gayi!")
//     );
//   } catch (error) {
//     return res.status(500).json(new ApiResponse(500, null, error.message));
//   }
// };


// // @POST /api/user/favourite/:shopId
// const toggleFavourite = async (req, res) => {
//   try {
//     const { shopId } = req.params;

//     const shop = await Shop.findById(shopId);
//     if (!shop) {
//       return res.status(404).json({
//         success: false,
//         message: 'Shop not found'
//       });
//     }

//     const existing = await Favorite.findOne({
//       userId: req.user._id,
//       shopId
//     });

//     if (existing) {
//       await existing.deleteOne();
//       return res.status(200).json({
//         success: true,
//         message: 'Removed from favourites',
//         isFavourite: false
//       });
//     }

//     await Favorite.create({
//       userId: req.user._id,
//       shopId
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Added to favourites',
//       isFavourite: true
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @GET /api/user/favourites
// const getMyFavourites = async (req, res) => {
//   try {
//     const favourites = await Favorite.find({ userId: req.user._id })
//       .populate('shopId', 'shopName slug logo category address isOpen rating themeColor');

//     res.status(200).json({
//       success: true,
//       count: favourites.length,
//       favourites
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @GET /api/user/profile
// const getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     res.status(200).json({
//       success: true,
//       user
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @PUT /api/user/profile
// const updateProfile = async (req, res) => {
//   try {
//     const { name, email, address } = req.body;
//     const user = await User.findById(req.user._id);

//     if (name) user.name = name;
//     if (email) user.email = email;
//     if (address) user.address = address;

//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: 'Profile updated',
//       user
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// module.exports = {
//   updateProfilePicture,
//   toggleFavourite,
//   getMyFavourites,
//   getProfile,
//   updateProfile
// };







// const User = require('../models/User');
// const Favorite = require('../models/Favorite');
// const Shop = require('../models/Shop');
// const { uploadImage } = require('../utils/uploadImage');

// // PUT /api/user/update-dp
// const updateProfilePicture = async (req, res) => {
//   try {
//     console.log('🔍 req.file:', req.file);        // file aa rahi hai?
//     console.log('🔍 req.user:', req.user?._id);   // user authenticate hai?

//     const userId = req.user._id;

//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: 'Image required hai'
//       });
//     }

//     const result = await uploadImage(req.file.buffer, 'apna-market/users');

//     if (!result.success) {
//       return res.status(500).json({
//         success: false,
//         message: 'Image upload failed: ' + result.message
//       });
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { profilePic: result.url },
//       { new: true }
//     ).select('-password');

//     return res.status(200).json({
//       success: true,
//       message: 'Profile picture update ho gayi!',
//       user: updatedUser
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @POST /api/user/favourite/:shopId
// const toggleFavourite = async (req, res) => {
//   try {
//     const { shopId } = req.params;

//     const shop = await Shop.findById(shopId);
//     if (!shop) {
//       return res.status(404).json({
//         success: false,
//         message: 'Shop not found'
//       });
//     }

//     const existing = await Favorite.findOne({
//       userId: req.user._id,
//       shopId
//     });

//     if (existing) {
//       await existing.deleteOne();
//       return res.status(200).json({
//         success: true,
//         message: 'Removed from favourites',
//         isFavourite: false
//       });
//     }

//     await Favorite.create({
//       userId: req.user._id,
//       shopId
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Added to favourites',
//       isFavourite: true
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @GET /api/user/favourites
// const getMyFavourites = async (req, res) => {
//   try {
//     const favourites = await Favorite.find({ userId: req.user._id })
//       .populate('shopId', 'shopName slug logo category address isOpen rating themeColor');

//     res.status(200).json({
//       success: true,
//       count: favourites.length,
//       favourites
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @GET /api/user/profile
// const getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     res.status(200).json({
//       success: true,
//       user
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @PUT /api/user/profile
// const updateProfile = async (req, res) => {
//   try {
//     const { name, email, address } = req.body;
//     const user = await User.findById(req.user._id);

//     if (name) user.name = name;
//     if (email) user.email = email;
//     if (address) user.address = address;

//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: 'Profile updated',
//       user
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// module.exports = {
//   updateProfilePicture,
//   toggleFavourite,
//   getMyFavourites,
//   getProfile,
//   updateProfile
// };





const User = require('../models/User');
const Favorite = require('../models/Favorite');
const Shop = require('../models/Shop');
const { uploadImage } = require('../utils/uploadImage');

// PUT /api/user/update-dp

const updateProfilePicture = async (req, res) => {
  try {
    console.log('DP START');
    console.log('req.files:', req.files);

    if (!req.files || !req.files.profilePic) {
      return res.status(400).json({
        success: false,
        message: 'Image required hai'
      });
    }

    const result = await uploadImage(
      req.files.profilePic.tempFilePath,
      'apna-market/users'
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Image upload failed: ' + result.message
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: result.url },
      { new: true }
    ).select('-password');

    return res.status(200).json({
      success: true,
      message: 'Profile picture update ho gayi!',
      user: updatedUser
    });

  } catch (error) {
    console.error('DP ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// @POST /api/user/favourite/:shopId
const toggleFavourite = async (req, res) => {
  try {
    const { shopId } = req.params;

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const existing = await Favorite.findOne({
      userId: req.user._id,
      shopId
    });

    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({
        success: true,
        message: 'Removed from favourites',
        isFavourite: false
      });
    }

    await Favorite.create({
      userId: req.user._id,
      shopId
    });

    res.status(201).json({
      success: true,
      message: 'Added to favourites',
      isFavourite: true
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @GET /api/user/favourites
const getMyFavourites = async (req, res) => {
  try {
    const favourites = await Favorite.find({ userId: req.user._id })
      .populate('shopId', 'shopName slug logo category address isOpen rating themeColor');

    res.status(200).json({
      success: true,
      count: favourites.length,
      favourites
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @GET /api/user/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @PUT /api/user/profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated',
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ @PUT /api/user/update-address
const updateAddress = async (req, res) => {
  try {
    const { fullAddress, city, pincode, location } = req.body;

    if (!location?.lat || !location?.lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude aur longitude required hain'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        address: {
          fullAddress: fullAddress || '',
          city: city || '',
          pincode: pincode || '',
          location: {
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lng),
          }
        }
      },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Address save ho gaya!',
      address: user.address
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  updateProfilePicture,
  toggleFavourite,
  getMyFavourites,
  getProfile,
  updateProfile,
  updateAddress,   // ✅ naya
};