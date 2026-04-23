const User = require('../models/User');
const Shop = require('../models/Shop');
const Order = require('../models/Order');
const Subscription = require('../models/Subscription');

// @GET /api/admin/overview
const getOverview = async (req, res) => {
  try {
    const totalShops = await Shop.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalOrders = await Order.countDocuments();

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const billingMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;

    const subscriptions = await Subscription.find({ billingMonth });
    const paidSubs = subscriptions.filter(s => s.isPaid);
    const unpaidSubs = subscriptions.filter(s => s.isRequired && !s.isPaid);
    const totalRevenue = paidSubs.length * 99;

    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: monthStart }
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: todayStart }
    });

    res.status(200).json({
      success: true,
      overview: {
        totalShops,
        totalUsers,
        totalOrders,
        todayOrders,
        newUsersThisMonth,
        totalRevenue,
        paidSubscriptions: paidSubs.length,
        unpaidSubscriptions: unpaidSubs.length,
        totalSubscriptions: subscriptions.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/admin/subscriptions
const getSubscriptions = async (req, res) => {
  try {
    const billingMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;

    const subscriptions = await Subscription.find({ billingMonth })
      .populate('shopId', 'shopName slug phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      subscriptions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/admin/subscription/:id/block
const blockSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription nahi mila' });
    }
    subscription.isPaid = false;
    subscription.adminVerified = false;
    subscription.utrNumber = 'BLOCKED';
    await subscription.save();

    res.status(200).json({ success: true, message: 'Shop blocked!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/admin/shops
const getShops = async (req, res) => {
  try {
    const shops = await Shop.find()
      .populate('ownerId', 'name phone email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: shops.length,
      shops
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/admin/shop/:id/toggle
const toggleShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop nahi mili' });
    }
    shop.isActive = !shop.isActive;
    await shop.save();

    res.status(200).json({
      success: true,
      message: `Shop ${shop.isActive ? 'activated' : 'deactivated'}!`,
      shop
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' })
      .select('name phone email createdAt')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getOverview,
  getSubscriptions,
  blockSubscription,
  getShops,
  toggleShop,
  getUsers
};