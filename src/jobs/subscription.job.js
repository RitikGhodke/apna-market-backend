// const cron = require('node-cron');
// const Shop = require('../models/Shop');
// const { checkAndCreateSubscription } = require('../services/subscription.service');

// const startSubscriptionJob = () => {
//   // Har mahine 1 tarikh ko run hoga
//   cron.schedule('0 0 1 * *', async () => {
//     console.log('Running monthly subscription check...');

//     try {
//       const shops = await Shop.find({ isActive: true });

//       for (const shop of shops) {
//         await checkAndCreateSubscription(shop._id);
//       }

//       console.log(`Subscription check done for ${shops.length} shops`);

//     } catch (error) {
//       console.log('Subscription job error:', error.message);
//     }
//   });

//   console.log('Subscription cron job started');
// };

// module.exports = { startSubscriptionJob };







const cron = require('node-cron');

const startSubscriptionJob = () => {
  cron.schedule('0 0 1 * *', async () => {
    console.log('New month started — fresh subscription tracking begins');
  });
  console.log('Subscription cron job started');
};

module.exports = { startSubscriptionJob };