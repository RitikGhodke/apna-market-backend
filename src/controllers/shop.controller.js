// const Shop = require('../models/Shop');
// const Product = require('../models/Product');
// const Order = require('../models/Order');
// const User = require('../models/User');

// // @GET /api/shop/:slug (Public - shop website)
// const getShopBySlug = async (req, res) => {
//   try {
//     const shop = await Shop.findOne({
//       slug: req.params.slug,
//       isActive: true
//     });

//     if (!shop) {
//       return res.status(404).json({
//         success: false,
//         message: 'Shop not found'
//       });
//     }

//     const products = await Product.find({
//       shopId: shop._id,
//       isAvailable: true
//     }).sort({ isFeatured: -1, createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       shop,
//       products
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @GET /api/shop/dashboard/analytics
// const getAnalytics = async (req, res) => {
//   try {
//     const shopId = req.shop._id;

//     // Today's orders
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const todayOrders = await Order.find({
//       shopId,
//       createdAt: { $gte: today }
//     });

//     const todaySales = todayOrders.reduce(
//       (sum, order) => sum + order.totalAmount, 0
//     );

//     // Total orders
//     const totalOrders = await Order.countDocuments({ shopId });

//     // Total customers
//     const uniqueCustomers = await Order.distinct('userId', { shopId });

//     // Top products
//     const topProducts = await Product.find({ shopId })
//       .sort({ totalSold: -1 })
//       .limit(5)
//       .select('name totalSold price');

//     // Weekly sales
//     const weekAgo = new Date();
//     weekAgo.setDate(weekAgo.getDate() - 7);

//     const weeklyOrders = await Order.find({
//       shopId,
//       createdAt: { $gte: weekAgo },
//       status: { $ne: 'cancelled' }
//     });

//     // Day wise sales
//     const dailySales = {};
//     const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//     weeklyOrders.forEach(order => {
//       const day = days[new Date(order.createdAt).getDay()];
//       dailySales[day] = (dailySales[day] || 0) + order.totalAmount;
//     });

//     // Monthly sales
//     const monthStart = new Date();
//     monthStart.setDate(1);
//     monthStart.setHours(0, 0, 0, 0);

//     const monthlyOrders = await Order.find({
//       shopId,
//       createdAt: { $gte: monthStart },
//       status: { $ne: 'cancelled' }
//     });

//     const monthlySales = monthlyOrders.reduce(
//       (sum, order) => sum + order.totalAmount, 0
//     );

//     res.status(200).json({
//       success: true,
//       analytics: {
//         todaySales,
//         todayOrders: todayOrders.length,
//         totalOrders,
//         totalCustomers: uniqueCustomers.length,
//         monthlySales,
//         topProducts,
//         dailySales
//       }
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @PUT /api/shop/update
// const updateShop = async (req, res) => {
//   try {
//     const {
//       shopName,
//       description,
//       phone,
//       address,
//       themeColor,
//       isOpen,
//       announcement
//     } = req.body;

//     const shop = req.shop;

//     if (shopName) shop.shopName = shopName;
//     if (description) shop.description = description;
//     if (phone) shop.phone = phone;
//     if (address) shop.address = address;
//     if (themeColor) shop.themeColor = themeColor;
//     if (isOpen !== undefined) shop.isOpen = isOpen;
//     if (announcement) shop.homePage.announcement = announcement;

//     await shop.save();

//     res.status(200).json({
//       success: true,
//       message: 'Shop updated successfully',
//       shop
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @PUT /api/shop/delivery-settings
// const updateDeliverySettings = async (req, res) => {
//   try {
//     const { deliveryEnabled, customDeliveryDiscount, maxDeliveryDistance } = req.body;

//     const shop = req.shop;

//     if (deliveryEnabled !== undefined) {
//       shop.deliverySettings.deliveryEnabled = deliveryEnabled;
//     }
//     if (customDeliveryDiscount !== undefined) {
//       shop.deliverySettings.customDeliveryDiscount = customDeliveryDiscount;
//     }
//     if (maxDeliveryDistance !== undefined) {
//       shop.deliverySettings.maxDeliveryDistance = maxDeliveryDistance;
//     }

//     await shop.save();

//     res.status(200).json({
//       success: true,
//       message: 'Delivery settings updated',
//       deliverySettings: shop.deliverySettings
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @PUT /api/shop/homepage
// const updateHomePage = async (req, res) => {
//   try {
//     const { featuredProducts, offers, announcement } = req.body;

//     const shop = req.shop;

//     if (featuredProducts) shop.homePage.featuredProducts = featuredProducts;
//     if (offers) shop.homePage.offers = offers;
//     if (announcement !== undefined) shop.homePage.announcement = announcement;

//     await shop.save();

//     res.status(200).json({
//       success: true,
//       message: 'Home page updated',
//       homePage: shop.homePage
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @GET /api/shop/dashboard/customers
// const getCustomers = async (req, res) => {
//   try {
//     const orders = await Order.find({ shopId: req.shop._id })
//       .populate('userId', 'name phone email profilePic')
//       .sort({ createdAt: -1 });

//     // Customer wise group karo
//     const customerMap = {};

//     orders.forEach(order => {
//       const userId = order.userId._id.toString();
//       if (!customerMap[userId]) {
//         customerMap[userId] = {
//           customer: order.userId,
//           totalOrders: 0,
//           totalSpent: 0,
//           lastOrder: order.createdAt
//         };
//       }
//       customerMap[userId].totalOrders += 1;
//       customerMap[userId].totalSpent += order.totalAmount;
//     });

//     const customers = Object.values(customerMap)
//       .sort((a, b) => b.totalOrders - a.totalOrders);

//     res.status(200).json({
//       success: true,
//       count: customers.length,
//       customers
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// module.exports = {
//   getShopBySlug,
//   getAnalytics,
//   updateShop,
//   updateDeliverySettings,
//   updateHomePage,
//   getCustomers
// };











const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// Helper: Base64 ya URL se Cloudinary pe upload karo
const uploadToCloudinary = async (fileBase64, folder) => {
  const result = await cloudinary.uploader.upload(fileBase64, {
    folder: `apna-market/${folder}`,
    transformation: folder === 'banners'
      ? [{ width: 1200, quality: 'auto' }]  // height aur crop: 'fill' hata diya
      : [{ width: 400, height: 400, crop: 'fill', quality: 'auto' }]
  });
  return result.secure_url;
};

// @GET /api/shop/:slug (Public)
const getShopBySlug = async (req, res) => {
  try {
    const shop = await Shop.findOne({ slug: req.params.slug, isActive: true });
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }
    const products = await Product.find({ shopId: shop._id, isAvailable: true })
      .sort({ isFeatured: -1, createdAt: -1 });
    res.status(200).json({ success: true, shop, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/shop/dashboard/analytics
const getAnalytics = async (req, res) => {
  try {
    const shopId = req.shop._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await Order.find({ shopId, createdAt: { $gte: today } });
    const todaySales = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = await Order.countDocuments({ shopId });
    const uniqueCustomers = await Order.distinct('userId', { shopId });

    const topProducts = await Product.find({ shopId })
      .sort({ totalSold: -1 }).limit(5).select('name totalSold price');

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyOrders = await Order.find({
      shopId, createdAt: { $gte: weekAgo }, status: { $ne: 'cancelled' }
    });

    const dailySales = {};
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weeklyOrders.forEach(order => {
      const day = days[new Date(order.createdAt).getDay()];
      dailySales[day] = (dailySales[day] || 0) + order.totalAmount;
    });

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthlyOrders = await Order.find({
      shopId, createdAt: { $gte: monthStart }, status: { $ne: 'cancelled' }
    });
    const monthlySales = monthlyOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // ── BEST SELLING TIME ──
const last30Days = new Date();
last30Days.setDate(last30Days.getDate() - 30);
const allOrders = await Order.find({
  shopId, createdAt: { $gte: last30Days }, status: { $ne: 'cancelled' }
});

const hourlyOrders = {};
allOrders.forEach(order => {
  const hour = new Date(order.createdAt).getHours();
  hourlyOrders[hour] = (hourlyOrders[hour] || 0) + 1;
});

// ── CUSTOMER RETENTION ──
const allCustomerIds = await Order.distinct('userId', { shopId });
const monthStart2 = new Date();
monthStart2.setDate(1);
monthStart2.setHours(0, 0, 0, 0);

const thisMonthCustomerIds = await Order.distinct('userId', {
  shopId, createdAt: { $gte: monthStart2 }
});

const lastMonthStart = new Date();
lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
lastMonthStart.setDate(1);
lastMonthStart.setHours(0, 0, 0, 0);

const lastMonthCustomerIds = await Order.distinct('userId', {
  shopId,
  createdAt: { $gte: lastMonthStart, $lt: monthStart2 }
});

const lastMonthSet = new Set(lastMonthCustomerIds.map(id => id.toString()));
const returningCustomers = thisMonthCustomerIds.filter(id => lastMonthSet.has(id.toString())).length;
const newCustomers = thisMonthCustomerIds.length - returningCustomers;

    res.status(200).json({
      success: true,
      analytics: {
        todaySales, todayOrders: todayOrders.length,
        totalOrders, totalCustomers: uniqueCustomers.length,
        monthlySales, topProducts, dailySales,
        hourlyOrders,        // ✅ Best Selling Time
    retention: {         // ✅ Customer Retention
      newCustomers,
      returningCustomers,
      totalThisMonth: thisMonthCustomerIds.length
    }
      }
    });

   

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/shop/update
const updateShop = async (req, res) => {
  try {
    const { shopName, description, phone, address, themeColor, isOpen, announcement, upiId } = req.body;
    const shop = req.shop;

    if (shopName) shop.shopName = shopName;
    if (description) shop.description = description;
    if (phone) shop.phone = phone;
    if (address) shop.address = address;
    if (themeColor) shop.themeColor = themeColor;
    if (isOpen !== undefined) shop.isOpen = isOpen;
    if (announcement) shop.homePage.announcement = announcement;
    if (upiId !== undefined) shop.upiId = upiId;
    if (req.body.offers !== undefined) shop.homePage.offers = req.body.offers;
    if (req.body.closedMessage !== undefined) shop.closedMessage = req.body.closedMessage;

    await shop.save();
    res.status(200).json({ success: true, message: 'Shop updated successfully', shop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ @PUT /api/shop/upload-logo (NAYA)
const uploadLogo = async (req, res) => {
  try {
    const { image } = req.body; // base64 image
    if (!image) {
      return res.status(400).json({ success: false, message: 'Image required' });
    }

    const logoUrl = await uploadToCloudinary(image, 'logos');
    req.shop.logo = logoUrl;
    await req.shop.save();

    res.status(200).json({ success: true, message: 'Logo upload ho gaya!', logo: logoUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ @PUT /api/shop/upload-banner (NAYA)
const uploadBanner = async (req, res) => {
  try {
    const { image } = req.body; // base64 image
    if (!image) {
      return res.status(400).json({ success: false, message: 'Image required' });
    }

    const bannerUrl = await uploadToCloudinary(image, 'banners');
    req.shop.banner = bannerUrl;
    await req.shop.save();

    res.status(200).json({ success: true, message: 'Banner upload ho gaya!', banner: bannerUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/shop/delivery-settings
const updateDeliverySettings = async (req, res) => {
  try {
    const {
      deliveryEnabled,
      customDeliveryDiscount,
      maxDeliveryDistance,
      freeDeliveryAbove,
      extendedDelivery
    } = req.body;
    const shop = req.shop;

    if (deliveryEnabled !== undefined) shop.deliverySettings.deliveryEnabled = deliveryEnabled;
    if (customDeliveryDiscount !== undefined) shop.deliverySettings.customDeliveryDiscount = customDeliveryDiscount;
    if (maxDeliveryDistance !== undefined) shop.deliverySettings.maxDeliveryDistance = maxDeliveryDistance;
    if (freeDeliveryAbove !== undefined) shop.deliverySettings.freeDeliveryAbove = freeDeliveryAbove;
    if (extendedDelivery !== undefined) shop.deliverySettings.extendedDelivery = extendedDelivery;
    if (req.body.deliveryOffToday !== undefined) shop.deliverySettings.deliveryOffToday = req.body.deliveryOffToday;
if (req.body.deliveryOffMessage !== undefined) shop.deliverySettings.deliveryOffMessage = req.body.deliveryOffMessage;

    await shop.save();
    res.status(200).json({ success: true, message: 'Delivery settings updated', deliverySettings: shop.deliverySettings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/shop/homepage
const updateHomePage = async (req, res) => {
  try {
    const { featuredProducts, offers, announcement } = req.body;
    const shop = req.shop;

    if (featuredProducts) shop.homePage.featuredProducts = featuredProducts;
    if (offers) shop.homePage.offers = offers;
    if (announcement !== undefined) shop.homePage.announcement = announcement;
    
    await shop.save();
    res.status(200).json({ success: true, message: 'Home page updated', homePage: shop.homePage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/shop/dashboard/customers
const getCustomers = async (req, res) => {
  try {
    const orders = await Order.find({ shopId: req.shop._id })
      .populate('userId', 'name phone email profilePic')
      .sort({ createdAt: -1 });

    const customerMap = {};
    orders.forEach(order => {
      const userId = order.userId._id.toString();
      if (!customerMap[userId]) {
        customerMap[userId] = {
          customer: order.userId,
          totalOrders: 0,
          totalSpent: 0,
          lastOrder: order.createdAt
        };
      }
      customerMap[userId].totalOrders += 1;
      customerMap[userId].totalSpent += order.totalAmount;
    });

    const customers = Object.values(customerMap).sort((a, b) => b.totalOrders - a.totalOrders);
    res.status(200).json({ success: true, count: customers.length, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const uploadBannerUrl = async (req, res) => {
  try {
    const { bannerUrl } = req.body;
    req.shop.banner = bannerUrl;
    await req.shop.save();
    res.status(200).json({ success: true, banner: bannerUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getShopBySlug,
  getAnalytics,
  updateShop,
  uploadLogo,   // ✅ naya
  uploadBanner, // ✅ naya
  updateDeliverySettings,
  updateHomePage,
  getCustomers,
   uploadBannerUrl,
};