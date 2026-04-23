// let io;

// const init = (socketIo) => {
//   io = socketIo;
// };

// const sendOrderNotification = (shopOwnerId, order) => {
//   if (io) {
//     io.to(`shop_${shopOwnerId}`).emit('new_order', {
//       message: 'New order received!',
//       order
//     });
//   }
// };

// const sendOrderStatusUpdate = (userId, order) => {
//   if (io) {
//     io.to(`user_${userId}`).emit('order_update', {
//       message: `Order status updated to ${order.status}`,
//       order
//     });
//   }
// };

// module.exports = { init, sendOrderNotification, sendOrderStatusUpdate };





let io;

const init = (socketIo) => {
  io = socketIo;
};

// Naya order aaya shop owner ko
const sendOrderNotification = (shopOwnerId, order) => {
  if (io) {
    io.to(`shop_${shopOwnerId}`).emit('new_order', {
      message: 'Naya order aaya!',
      order
    });
  }
};

// Order status update customer ko
const sendOrderStatusUpdate = (userId, order) => {
  if (io) {
    io.to(`user_${userId}`).emit('order_update', {
      message: `Order status updated to ${order.status}`,
      order
    });
  }
};

// Jab udhar order accept ho — shop owner ko confirm + customer ko bhi
const sendUdharCreatedNotification = (shopOwnerId, customerId, udhar, order) => {
  if (io) {
    // Shop owner ko
    io.to(`shop_${shopOwnerId}`).emit('udhar_created', {
      message: `💳 ${udhar.customerName} ka ₹${order.totalAmount} udhar add ho gaya!`,
      udhar,
      order
    });

    // Customer ko
    io.to(`user_${customerId}`).emit('udhar_added', {
      message: `✅ Tumhara ₹${order.totalAmount} ka udhar ${udhar.shopName || 'shop'} mein add ho gaya!`,
      udhar,
      order
    });
  }
};

// Jab customer payment kare — shop owner ko alert
const sendUdharPaymentAlert = (shopOwnerId, customerName, amount, remainingAmount) => {
  if (io) {
    io.to(`shop_${shopOwnerId}`).emit('udhar_payment_received', {
      message: `💰 ${customerName} ne ₹${amount} pay kar diya! Remaining: ₹${remainingAmount}`,
      customerName,
      amount,
      remainingAmount
    });
  }
};

// Jab customer payment kare — customer ko confirm
const sendUdharPaymentConfirm = (customerId, amount, shopName, remainingAmount) => {
  if (io) {
    io.to(`user_${customerId}`).emit('udhar_payment_confirmed', {
      message: `✅ ₹${amount} payment ${shopName} ko successfully bheja gaya!`,
      amount,
      shopName,
      remainingAmount
    });
  }
};

// Shop owner customer ko remind kare
const sendUdharReminder = (customerId, shopName, remainingAmount) => {
  if (io) {
    io.to(`user_${customerId}`).emit('udhar_reminder', {
      message: `🔔 ${shopName} se reminder: Aapka ₹${remainingAmount} udhar pending hai!`,
      shopName,
      remainingAmount
    });
  }
};

const sendUpiPaymentSubmitted = (shopOwnerId, order, utrNumber) => {
  if (io) {
    io.to(`shop_${shopOwnerId}`).emit('upi_payment_submitted', {
      message: `💳 UPI Payment submitted! Order #${order.orderId} — UTR: ${utrNumber}`,
      order,
      utrNumber
    });
  }
};

const sendUpiPaymentVerified = (userId, order) => {
  if (io) {
    io.to(`user_${userId}`).emit('upi_payment_verified', {
      message: `✅ Tumhari UPI payment verify ho gayi! Order #${order.orderId} accept ho gaya.`,
      order
    });
  }
};

// Low stock alert — shop owner ko
const sendLowStockAlert = (shopOwnerId, product) => {
  if (io) {
    io.to(`shop_${shopOwnerId}`).emit('low_stock_alert', {
      message: `⚠️ "${product.name}" ka stock sirf ${product.stock} bacha hai!`,
      product
    });
  }
};

module.exports = {
  init,
  sendOrderNotification,
  sendOrderStatusUpdate,
  sendUdharCreatedNotification,
  sendUdharPaymentAlert,
  sendUdharPaymentConfirm,
  sendUdharReminder,
  sendUpiPaymentSubmitted,
  sendUpiPaymentVerified,
   sendLowStockAlert
};