const { uploadImage, deleteImage } = require('../utils/uploadImage');
const Shop = require('../models/Shop');
const Product = require('../models/Product');

// @POST /api/upload/shop-logo
const uploadShopLogo = async (req, res) => {
  try {
    if (!req.files || !req.files.logo) {
      return res.status(400).json({
        success: false,
        message: 'Logo file required'
      });
    }

    const result = await uploadImage(
      req.files.logo.tempFilePath,
      'apna-market/logos'
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message
      });
    }

    await Shop.findByIdAndUpdate(req.shop._id, { logo: result.url });

    res.status(200).json({
      success: true,
      message: 'Logo uploaded successfully',
      url: result.url
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @POST /api/upload/shop-banner
const uploadShopBanner = async (req, res) => {
  try {
    if (!req.files || !req.files.banner) {
      return res.status(400).json({
        success: false,
        message: 'Banner file required'
      });
    }

    const result = await uploadImage(
      req.files.banner.tempFilePath,
      'apna-market/banners'
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message
      });
    }

    await Shop.findByIdAndUpdate(req.shop._id, { banner: result.url });

    res.status(200).json({
      success: true,
      message: 'Banner uploaded successfully',
      url: result.url
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @POST /api/upload/product-image/:productId
const uploadProductImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: 'Image file required'
      });
    }

    const product = await Product.findOne({
      _id: req.params.productId,
      shopId: req.shop._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const result = await uploadImage(
      req.files.image.tempFilePath,
      'apna-market/products'
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message
      });
    }

    product.images.push(result.url);
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: result.url,
      images: product.images
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  uploadShopLogo,
  uploadShopBanner,
  uploadProductImage
};