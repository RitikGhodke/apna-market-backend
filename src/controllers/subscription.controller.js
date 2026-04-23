// const Subscription = require('../models/Subscription');
// const { checkAndCreateSubscription, getShopSubscription } = require('../services/subscription.service');

// // @GET /api/subscription/status
// const getSubscriptionStatus = async (req, res) => {
//   try {
//     const subscription = await getShopSubscription(req.shop._id);

//     if (!subscription) {
//       return res.status(200).json({
//         success: true,
//         message: 'No subscription this month',
//         subscription: null,
//         isFree: true
//       });
//     }

//     res.status(200).json({
//       success: true,
//       subscription,
//       isFree: subscription.amount === 0
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @POST /api/subscription/check
// const checkSubscription = async (req, res) => {
//   try {
//     const subscription = await checkAndCreateSubscription(req.shop._id);

//     res.status(200).json({
//       success: true,
//       subscription,
//       isFree: subscription.amount === 0,
//       message: subscription.amount === 0
//         ? 'Free plan — sales under ₹100'
//         : `₹100 subscription due for this month`
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// module.exports = { getSubscriptionStatus, checkSubscription };








const Subscription = require('../models/Subscription');
const {
  getShopSubscription,
  isShopLocked
} = require('../services/subscription.service');

// @GET /api/subscription/status
const getSubscriptionStatus = async (req, res) => {
  try {
    const subscription = await getShopSubscription(req.shop._id);
    const locked = await isShopLocked(req.shop._id);

    res.status(200).json({
      success: true,
      subscription: subscription || null,
      isLocked: locked,
      isFree: !subscription?.isRequired,
      monthSales: subscription?.monthSales || 0
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/subscription/submit-payment
const submitPayment = async (req, res) => {
  try {
    const { utrNumber } = req.body;
    if (!utrNumber || utrNumber.trim().length < 6) {
      return res.status(400).json({ success: false, message: 'Valid UTR number dalo' });
    }

    const billingMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
    const subscription = await Subscription.findOne({
      shopId: req.shop._id,
      billingMonth
    });

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription nahi mila' });
    }

    const now = new Date();
    subscription.utrNumber = utrNumber.trim();
    subscription.isPaid = true;
    subscription.paidAt = now;
    subscription.validTill = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    subscription.adminVerified = false;

    await subscription.save();

    res.status(200).json({
      success: true,
      message: '✅ Payment verified! Dashboard unlock ho gaya.',
      subscription
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSubscriptionStatus, submitPayment };