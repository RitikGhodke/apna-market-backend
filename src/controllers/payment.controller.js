const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Subscription = require('../models/Subscription');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @POST /api/payment/create-order
const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Razorpay order create karo
    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalAmount * 100, // paise mein
      currency: 'INR',
      receipt: order.orderId,
      notes: {
        orderId: order._id.toString(),
        userId: req.user._id.toString()
      }
    });

    // Order mein razorpay id save karo
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(200).json({
      success: true,
      razorpayOrder,
      order,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @POST /api/payment/verify
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    // Signature verify karo
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Order update karo
    const order = await Order.findById(orderId);
    order.paymentStatus = 'paid';
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @POST /api/payment/subscription
const createSubscriptionPayment = async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    if (subscription.amount === 0) {
      return res.status(400).json({
        success: false,
        message: 'No payment required — free plan'
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: subscription.amount * 100,
      currency: 'INR',
      receipt: `sub_${subscriptionId}`,
      notes: {
        subscriptionId: subscriptionId.toString(),
        shopId: subscription.shopId.toString()
      }
    });

    res.status(200).json({
      success: true,
      razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @POST /api/payment/verify-subscription
const verifySubscriptionPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      subscriptionId
    } = req.body;

    // Signature verify
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Subscription update karo
    const subscription = await Subscription.findById(subscriptionId);
    subscription.isPaid = true;
    subscription.paidAt = new Date();
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Subscription payment verified',
      subscription
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const createUpiOrder = async (req, res) => {
  try {
    const { deliveryAddress } = req.body;

    

    if (!deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address required hai'
      });
    }

    const Cart = require('../models/Cart');
    const Shop = require('../models/Shop');
    const Product = require('../models/Product');
    const { generateOrderId } = require('../utils/helpers');
    const { sendOrderNotification } = require('../services/notification.service');

    const cart = await Cart.findOne({ userId: req.user._id });
     
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart empty hai'
      });
    }

    const shop = await Shop.findById(cart.shopId);

     
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop nahi mili'
      });
    }

    if (!shop.upiId) {
      return res.status(400).json({
        success: false,
        message: 'Is shop ne UPI ID set nahi ki — COD ya Udhar use karo'
      });
    }

    // Order banao — paymentStatus 'upi_pending' rahega
    const order = await Order.create({
      orderId: generateOrderId(),
      userId: req.user._id,
      shopId: cart.shopId,
      items: cart.items,
      productTotal: cart.totalProductPrice,
      deliveryCharge: cart.deliveryCharge,
      totalAmount: cart.totalAmount,
      deliveryAddress,
      paymentMethod: 'ONLINE',
      paymentStatus: 'upi_pending',
      status: 'pending'
    });

    // Shop stats + stock update
    await Shop.findByIdAndUpdate(cart.shopId, { $inc: { totalOrders: 1 } });
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { totalSold: item.quantity, stock: -item.quantity }
      });
    }

    // Shop owner ko notification
    sendOrderNotification(shop.ownerId, order);

    // Cart clear
    await Cart.findOneAndDelete({ userId: req.user._id });

    res.status(201).json({
      success: true,
      message: 'Order created — ab UPI se pay karo',
      order,
      upiId: shop.upiId,         // Shop ka UPI ID frontend ko dena
      shopName: shop.shopName
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/payment/upi-confirm
// Customer UTR submit kare — shop owner verify karega
const confirmUpiPayment = async (req, res) => {
  try {
    const { orderId, utrNumber } = req.body;

    if (!orderId || !utrNumber) {
      return res.status(400).json({
        success: false,
        message: 'orderId aur utrNumber required hain'
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      userId: req.user._id,
      paymentMethod: 'ONLINE',
      paymentStatus: 'upi_pending'
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order nahi mila ya already confirm ho gaya'
      });
    }

    // UTR save karo — status 'upi_submitted' karo
    order.utrNumber = utrNumber;
    order.paymentStatus = 'upi_submitted';
    await order.save();

    // Shop owner ko notify karo ki payment submitted hai
    const Shop = require('../models/Shop');
    const { sendUpiPaymentSubmitted } = require('../services/notification.service');
    const shop = await Shop.findById(order.shopId);
    if (shop) {
      sendUpiPaymentSubmitted(shop.ownerId, order, utrNumber);
    }

    res.status(200).json({
      success: true,
      message: 'Payment details submit ho gaya! Shop owner verify karega.',
      order
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyUpiByOwner = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      shopId: req.shop._id,
      paymentMethod: 'ONLINE',
      paymentStatus: 'upi_submitted'
    });
 
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order nahi mila ya payment submitted nahi hai'
      });
    }
 
    // Payment paid mark karo + order accept
    order.paymentStatus = 'paid';
    order.status = 'accepted';
    await order.save();
 
    // Customer ko notify karo
    const { sendOrderStatusUpdate, sendUpiPaymentVerified } = require('../services/notification.service');
    sendOrderStatusUpdate(order.userId, order);
    sendUpiPaymentVerified(order.userId, order);
 
    res.status(200).json({
      success: true,
      message: 'UPI payment verified! Order accepted.',
      order
    });
 
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



module.exports = {
  createPaymentOrder,
  verifyPayment,
  createSubscriptionPayment,
  verifySubscriptionPayment,
  createUpiOrder,
  confirmUpiPayment,
  verifyUpiByOwner
  
};