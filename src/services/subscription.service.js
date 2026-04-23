// const Subscription = require('../models/Subscription');
// const Order = require('../models/Order');
// const Shop = require('../models/Shop');

// const checkAndCreateSubscription = async (shopId) => {
//   try {
//     const now = new Date();
//     const billingMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;

//     // Is month ka subscription check karo
//     let subscription = await Subscription.findOne({ shopId, billingMonth });

//     if (subscription) return subscription;

//     // Is month ki total sales calculate karo
//     const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
//     const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

//     const orders = await Order.find({
//       shopId,
//       status: 'delivered',
//       createdAt: { $gte: monthStart, $lte: monthEnd }
//     });

//     const monthlySales = orders.reduce((sum, o) => sum + o.totalAmount, 0);

//     // Rule: agar sales >= 100 to fee lagegi
//     subscription = await Subscription.create({
//       shopId,
//       monthlySales,
//       isPaid: false,
//       amount: monthlySales >= 100 ? 100 : 0,
//       billingMonth,
//       dueDate: monthEnd
//     });

//     return subscription;

//   } catch (error) {
//     console.log('Subscription check error:', error.message);
//   }
// };

// const getShopSubscription = async (shopId) => {
//   const now = new Date();
//   const billingMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;

//   return await Subscription.findOne({ shopId, billingMonth });
// };

// module.exports = { checkAndCreateSubscription, getShopSubscription };









const Subscription = require('../models/Subscription');
const Order = require('../models/Order');

const getBillingMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}`;
};

const getMonthStart = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const getMonthSales = async (shopId) => {
  const monthStart = getMonthStart();
  const now = new Date();
  const orders = await Order.find({
    shopId,
    status: 'delivered',
    createdAt: { $gte: monthStart, $lte: now }
  });
  return orders.reduce((sum, o) => sum + o.totalAmount, 0);
};

const checkAndUpdateSubscription = async (shopId) => {
  try {
    const billingMonth = getBillingMonth();
    const monthSales = await getMonthSales(shopId);

    let subscription = await Subscription.findOne({ shopId, billingMonth });

    if (!subscription) {
      subscription = new Subscription({
        shopId,
        billingMonth,
        monthSales,
        isRequired: false,
        isPaid: false
      });
    }

    subscription.monthSales = monthSales;

    if (monthSales >= 1000 && !subscription.isRequired) {
      subscription.isRequired = true;
      subscription.isPaid = false;
    }

    await subscription.save();
    return subscription;

  } catch (error) {
    console.log('Subscription check error:', error.message);
  }
};

const getShopSubscription = async (shopId) => {
  const billingMonth = getBillingMonth();
  return await Subscription.findOne({ shopId, billingMonth });
};

const isShopLocked = async (shopId) => {
  const subscription = await getShopSubscription(shopId);
  if (!subscription) return false;
  if (!subscription.isRequired) return false;
  if (subscription.isPaid) return false;
  return true;
};

module.exports = {
  checkAndUpdateSubscription,
  getShopSubscription,
  isShopLocked
};