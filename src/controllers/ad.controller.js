const Ad = require('../models/Ad');
const Shop = require('../models/Shop');

// @POST /api/ads/create
const createAd = async (req, res) => {
  try {
    const { type, days } = req.body;

    if (!days || days < 1) {
      return res.status(400).json({
        success: false,
        message: 'Days required'
      });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    const amount = days >= 30 ? 500 : days * 50;

    const ad = await Ad.create({
      shopId: req.shop._id,
      type: type || 'featured',
      amount,
      startDate,
      endDate,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Ad created successfully',
      ad,
      amount
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @GET /api/ads/my-ads
const getMyAds = async (req, res) => {
  try {
    const ads = await Ad.find({ shopId: req.shop._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: ads.length,
      ads
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @GET /api/ads/featured (Public)
const getFeaturedShops = async (req, res) => {
  try {
    const now = new Date();
    const Product = require('../models/Product'); // ✅ add karo top pe ya yahan

    const activeAds = await Ad.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).populate('shopId', 'shopName slug logo banner category address isOpen rating themeColor deliverySettings totalOrders');

    // ✅ Products fetch karo har shop ke liye
    const featuredShops = await Promise.all(
      activeAds.map(async (ad) => {
        if (!ad.shopId) return null;
        const products = await Product.find({ shopId: ad.shopId._id, isAvailable: true })
          .select('name price images')
          .limit(2);
        return { ...ad.shopId.toObject(), products, isFeatured: true };
      })
    );

    res.status(200).json({
      success: true,
      count: featuredShops.length,
      featuredShops: featuredShops.filter(s => s !== null)
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { createAd, getMyAds, getFeaturedShops };