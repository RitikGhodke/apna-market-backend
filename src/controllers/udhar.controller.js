// const Udhar = require('../models/Udhar');
// const User = require('../models/User');

// // @POST /api/udhar/add
// const addUdhar = async (req, res) => {
//   try {
//     const { customerPhone, amount, note } = req.body;

//     if (!customerPhone || !amount) {
//       return res.status(400).json({
//         success: false,
//         message: 'Customer phone and amount required'
//       });
//     }

//     // Customer dhundo
//     const customer = await User.findOne({ phone: customerPhone });
//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: 'Customer not found'
//       });
//     }

//     // Pehle se udhar hai?
//     let udhar = await Udhar.findOne({
//       shopId: req.shop._id,
//       customerId: customer._id
//     });

//     if (udhar) {
//       // Existing udhar mein add karo
//       udhar.totalAmount += amount;
//       udhar.remainingAmount += amount;
//       udhar.transactions.push({
//         amount,
//         type: 'credit',
//         note: note || '',
//         date: new Date()
//       });
//     } else {
//       // Naya udhar banao
//       udhar = new Udhar({
//         shopId: req.shop._id,
//         customerId: customer._id,
//         customerName: customer.name,
//         customerPhone: customer.phone,
//         totalAmount: amount,
//         paidAmount: 0,
//         remainingAmount: amount,
//         transactions: [{
//           amount,
//           type: 'credit',
//           note: note || '',
//           date: new Date()
//         }]
//       });
//     }

//     await udhar.save();

//     res.status(201).json({
//       success: true,
//       message: 'Udhar added successfully',
//       udhar
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @POST /api/udhar/payment
// const addPayment = async (req, res) => {
//   try {
//     const { customerPhone, amount, note } = req.body;

//     if (!customerPhone || !amount) {
//       return res.status(400).json({
//         success: false,
//         message: 'Customer phone and amount required'
//       });
//     }

//     const customer = await User.findOne({ phone: customerPhone });
//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: 'Customer not found'
//       });
//     }

//     const udhar = await Udhar.findOne({
//       shopId: req.shop._id,
//       customerId: customer._id
//     });

//     if (!udhar) {
//       return res.status(404).json({
//         success: false,
//         message: 'No udhar found for this customer'
//       });
//     }

//     if (amount > udhar.remainingAmount) {
//       return res.status(400).json({
//         success: false,
//         message: `Remaining amount is only ₹${udhar.remainingAmount}`
//       });
//     }

//     udhar.paidAmount += amount;
//     udhar.remainingAmount -= amount;
//     udhar.transactions.push({
//       amount,
//       type: 'payment',
//       note: note || '',
//       date: new Date()
//     });

//     await udhar.save();

//     res.status(200).json({
//       success: true,
//       message: 'Payment recorded successfully',
//       udhar
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @GET /api/udhar/list
// const getUdharList = async (req, res) => {
//   try {
//     const udhars = await Udhar.find({ shopId: req.shop._id })
//       .sort({ remainingAmount: -1 });

//     const totalDue = udhars.reduce((sum, u) => sum + u.remainingAmount, 0);
//     const totalRecovered = udhars.reduce((sum, u) => sum + u.paidAmount, 0);

//     res.status(200).json({
//       success: true,
//       count: udhars.length,
//       totalDue,
//       totalRecovered,
//       udhars
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @GET /api/udhar/:customerId
// const getCustomerUdhar = async (req, res) => {
//   try {
//     const udhar = await Udhar.findOne({
//       shopId: req.shop._id,
//       customerId: req.params.customerId
//     });

//     if (!udhar) {
//       return res.status(404).json({
//         success: false,
//         message: 'No udhar found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       udhar
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// module.exports = { addUdhar, addPayment, getUdharList, getCustomerUdhar };












const Udhar = require('../models/Udhar');
const User = require('../models/User');
const Shop = require('../models/Shop');
const {
  sendUdharPaymentAlert,
  sendUdharPaymentConfirm,
  sendUdharReminder
} = require('../services/notification.service');

// ─────────────────────────────────────────────
// INTERNAL FUNCTION — Order accept hone par auto call hoga
// order.controller.js se call hoga, route se nahi
// ─────────────────────────────────────────────
const createUdharFromOrder = async (order, shop) => {
  try {
    const customer = await User.findById(order.userId);
    if (!customer) return;

    let udhar = await Udhar.findOne({
      shopId: shop._id,
      customerId: customer._id
    });

    const transaction = {
      amount: order.totalAmount,
      type: 'credit',
      note: order.udharNote || '',
      orderId: order._id,
      orderDisplayId: order.orderId,
      items: order.items.map(i => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price
      })),
      date: new Date()
    };

    if (udhar) {
      // Existing customer — amount add karo
      udhar.totalAmount += order.totalAmount;
      udhar.remainingAmount += order.totalAmount;
      udhar.lastUdharDate = new Date();
      udhar.transactions.push(transaction);
    } else {
      // Naya customer udhar
      udhar = new Udhar({
        shopId: shop._id,
        customerId: customer._id,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerProfilePic: customer.profilePic || '',
        shopName: shop.shopName,
        totalAmount: order.totalAmount,
        paidAmount: 0,
        remainingAmount: order.totalAmount,
        lastUdharDate: new Date(),
        transactions: [transaction]
      });
    }

    await udhar.save();
    return udhar;
  } catch (error) {
    console.error('createUdharFromOrder error:', error.message);
  }
};

// ─────────────────────────────────────────────
// @GET /api/udhar/list  — Shop Owner: apne shop ka saara udhar
// ─────────────────────────────────────────────
const getUdharList = async (req, res) => {
  try {
    const udhars = await Udhar.find({ shopId: req.shop._id })
      .sort({ remainingAmount: -1 });

    const totalDue = udhars.reduce((sum, u) => sum + u.remainingAmount, 0);
    const totalRecovered = udhars.reduce((sum, u) => sum + u.paidAmount, 0);

    res.status(200).json({
      success: true,
      count: udhars.length,
      totalDue,
      totalRecovered,
      udhars
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @GET /api/udhar/my-udhar  — Customer: apna saara udhar dekhe
// ─────────────────────────────────────────────
const getMyUdhar = async (req, res) => {
  try {
    const udhars = await Udhar.find({
      customerId: req.user._id,
      remainingAmount: { $gt: 0 }
    }).sort({ lastUdharDate: -1 });

    // Paid history bhi
    const paidUdhars = await Udhar.find({
      customerId: req.user._id,
      remainingAmount: 0,
      totalAmount: { $gt: 0 }
    }).sort({ updatedAt: -1 }).limit(10);

    const totalPending = udhars.reduce((sum, u) => sum + u.remainingAmount, 0);

    res.status(200).json({
      success: true,
      totalPending,
      udhars,
      paidUdhars
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @POST /api/udhar/pay  — Customer: payment kare
// ─────────────────────────────────────────────
const customerPayUdhar = async (req, res) => {
  try {
    const { udharId, amount, paymentMethod } = req.body;

    if (!udharId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'udharId aur amount required hai'
      });
    }

    const udhar = await Udhar.findOne({
      _id: udharId,
      customerId: req.user._id
    });

    if (!udhar) {
      return res.status(404).json({
        success: false,
        message: 'Udhar nahi mila'
      });
    }

    if (amount > udhar.remainingAmount) {
      return res.status(400).json({
        success: false,
        message: `Remaining amount sirf ₹${udhar.remainingAmount} hai`
      });
    }

    // Payment record karo
    udhar.paidAmount += amount;
    udhar.remainingAmount -= amount;
    udhar.transactions.push({
      amount,
      type: 'payment',
      note: `Online payment via ${paymentMethod || 'UPI'}`,
      date: new Date()
    });

    await udhar.save();

    // Shop owner ka ownerId chahiye notification ke liye
    const Shop = require('../models/Shop');
    const shop = await Shop.findById(udhar.shopId);

    // Notifications bhejo
    if (shop) {
      sendUdharPaymentAlert(
        shop.ownerId,
        udhar.customerName,
        amount,
        udhar.remainingAmount
      );
    }

    sendUdharPaymentConfirm(
      req.user._id,
      amount,
      udhar.shopName,
      udhar.remainingAmount
    );

    res.status(200).json({
      success: true,
      message: `₹${amount} payment successful!`,
      udhar
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @POST /api/udhar/remind/:customerId  — Shop Owner: customer ko remind kare
// ─────────────────────────────────────────────
const remindCustomer = async (req, res) => {
  try {
    const udhar = await Udhar.findOne({
      shopId: req.shop._id,
      customerId: req.params.customerId
    });

    if (!udhar) {
      return res.status(404).json({
        success: false,
        message: 'Udhar nahi mila'
      });
    }

    if (udhar.remainingAmount === 0) {
      return res.status(400).json({
        success: false,
        message: 'Is customer ka koi pending udhar nahi hai'
      });
    }

    sendUdharReminder(
      udhar.customerId,
      udhar.shopName,
      udhar.remainingAmount
    );

    res.status(200).json({
      success: true,
      message: `${udhar.customerName} ko reminder bhej diya!`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @POST /api/udhar/add-payment  — Shop Owner: manually payment record kare
// ─────────────────────────────────────────────
const addPayment = async (req, res) => {
  try {
    const { customerPhone, amount, note } = req.body;

    if (!customerPhone || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Customer phone aur amount required'
      });
    }

    const customer = await User.findOne({ phone: customerPhone });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer nahi mila'
      });
    }

    const udhar = await Udhar.findOne({
      shopId: req.shop._id,
      customerId: customer._id
    });

    if (!udhar) {
      return res.status(404).json({
        success: false,
        message: 'Is customer ka koi udhar nahi hai'
      });
    }

    if (amount > udhar.remainingAmount) {
      return res.status(400).json({
        success: false,
        message: `Remaining amount sirf ₹${udhar.remainingAmount} hai`
      });
    }

    udhar.paidAmount += amount;
    udhar.remainingAmount -= amount;

if (udhar.remainingAmount === 0) {
  const Order = require('../models/Order');
  await Order.updateMany(
    { userId: udhar.customerId, shopId: udhar.shopId, paymentMethod: 'UDHAR' },
    { paymentStatus: 'paid' }
  );
}

    udhar.transactions.push({
      amount,
      type: 'payment',
      note: note || 'Cash payment',
      date: new Date()
    });

    await udhar.save();

    // Customer ko notify karo
    sendUdharPaymentConfirm(
      customer._id,
      amount,
      udhar.shopName,
      udhar.remainingAmount
    );

    res.status(200).json({
      success: true,
      message: 'Payment record ho gaya!',
      udhar
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @GET /api/udhar/customer/:customerId  — Shop Owner: ek customer ka detail
// ─────────────────────────────────────────────
const getCustomerUdhar = async (req, res) => {
  try {
    const udhar = await Udhar.findOne({
      shopId: req.shop._id,
      customerId: req.params.customerId
    });

    if (!udhar) {
      return res.status(404).json({
        success: false,
        message: 'Udhar nahi mila'
      });
    }

    res.status(200).json({ success: true, udhar });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createUdharFromOrder,
  getUdharList,
  getMyUdhar,
  customerPayUdhar,
  remindCustomer,
  addPayment,
  getCustomerUdhar
};