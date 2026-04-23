const Shop = require('../models/Shop');

const isShopOwner = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ ownerId: req.user._id });

    if (!shop) {
      return res.status(403).json({
        success: false,
        message: 'You are not a shop owner'
      });
    }

    req.shop = shop;
    next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = isShopOwner;