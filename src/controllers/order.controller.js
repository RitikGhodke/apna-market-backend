// const Order = require('../models/Order');
// const Cart = require('../models/Cart');
// const Shop = require('../models/Shop');
// const Product = require('../models/Product');
// const { generateOrderId } = require('../utils/helpers');
// const { sendOrderNotification, sendOrderStatusUpdate } = require('../services/notification.service');

// // @POST /api/orders/place
// const placeOrder = async (req, res) => {
//   try {
//     const { paymentMethod, deliveryAddress } = req.body;

//     if (!deliveryAddress) {
//       return res.status(400).json({
//         success: false,
//         message: 'Delivery address is required'
//       });
//     }

//     // Cart find karo
//     const cart = await Cart.findOne({ userId: req.user._id });
//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cart is empty'
//       });
//     }

//     // Order create karo
//     const order = await Order.create({
//       orderId: generateOrderId(),
//       userId: req.user._id,
//       shopId: cart.shopId,
//       items: cart.items,
//       productTotal: cart.totalProductPrice,
//       deliveryCharge: cart.deliveryCharge,
//       totalAmount: cart.totalAmount,
//       deliveryAddress,
//       paymentMethod: paymentMethod || 'COD',
//       status: 'pending'
//     });

//     // Shop ka totalOrders update karo
//     await Shop.findByIdAndUpdate(cart.shopId, {
//       $inc: { totalOrders: 1 }
//     });

//     // Products ka totalSold update karo
//     for (const item of cart.items) {
//       await Product.findByIdAndUpdate(item.productId, {
//         $inc: { totalSold: item.quantity, stock: -item.quantity }
//       });
//     }

//     // Shop owner ko notification bhejo
//     const shop = await Shop.findById(cart.shopId);
//     sendOrderNotification(shop.ownerId, order);

//     // Cart clear karo
//     await Cart.findOneAndDelete({ userId: req.user._id });

//     res.status(201).json({
//       success: true,
//       message: 'Order placed successfully',
//       order
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @GET /api/orders/my-orders (customer)
// const getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ userId: req.user._id })
//       .populate('shopId', 'shopName logo slug')
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @GET /api/orders/shop-orders (shop owner)
// const getShopOrders = async (req, res) => {
//   try {
//     const { status } = req.query;
//     let filter = { shopId: req.shop._id };
//     if (status) filter.status = status;

//     const orders = await Order.find(filter)
//       .populate('userId', 'name phone')
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @PUT /api/orders/:id/status (shop owner)
// const updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     const validStatus = ['pending', 'accepted', 'out_for_delivery', 'delivered', 'cancelled'];
//     if (!validStatus.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status'
//       });
//     }

//     const order = await Order.findOne({
//       _id: req.params.id,
//       shopId: req.shop._id
//     });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     order.status = status;
//     await order.save();

//     // Customer ko notification bhejo
//     sendOrderStatusUpdate(order.userId, order);

//     res.status(200).json({
//       success: true,
//       message: `Order status updated to ${status}`,
//       order
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @GET /api/orders/:id (single order)
// const getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate('shopId', 'shopName logo phone address')
//       .populate('userId', 'name phone');

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     // Sirf apna order dekh sakta hai
//     if (
//       order.userId._id.toString() !== req.user._id.toString() &&
//       order.shopId.toString() !== req.shop?._id?.toString()
//     ) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       order
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @PUT /api/orders/:id/cancel (customer)
// const cancelOrder = async (req, res) => {
//   try {
//     const order = await Order.findOne({
//       _id: req.params.id,
//       userId: req.user._id
//     });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     if (order.status !== 'pending') {
//       return res.status(400).json({
//         success: false,
//         message: 'Sirf pending orders cancel ho sakte hain'
//       });
//     }

//     order.status = 'cancelled';
//     await order.save();

//     // Stock wapas karo
//     for (const item of order.items) {
//       await Product.findByIdAndUpdate(item.productId, {
//         $inc: { stock: item.quantity }
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Order cancelled successfully',
//       order
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// module.exports = {
//   placeOrder,
//   getMyOrders,
//   getShopOrders,
//   updateOrderStatus,
//   getOrderById,
//   cancelOrder
// };









// const Order = require('../models/Order');
// const Cart = require('../models/Cart');
// const Shop = require('../models/Shop');
// const Product = require('../models/Product');
// const { generateOrderId } = require('../utils/helpers');
// const { sendOrderNotification, sendOrderStatusUpdate } = require('../services/notification.service');

// // @POST /api/orders/place
// const placeOrder = async (req, res) => {
//   try {
//     const { paymentMethod, deliveryAddress, udharNote } = req.body;

//     if (!deliveryAddress) {
//       return res.status(400).json({
//         success: false,
//         message: 'Delivery address is required'
//       });
//     }

//     const cart = await Cart.findOne({ userId: req.user._id });
//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cart is empty'
//       });
//     }

//     const isUdhar = paymentMethod === 'UDHAR';
//     const udharDueDate = isUdhar
//       ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
//       : null;

//     const order = await Order.create({
//       orderId: generateOrderId(),
//       userId: req.user._id,
//       shopId: cart.shopId,
//       items: cart.items,
//       productTotal: cart.totalProductPrice,
//       deliveryCharge: cart.deliveryCharge,
//       totalAmount: cart.totalAmount,
//       deliveryAddress,
//       paymentMethod: paymentMethod || 'COD',
//       paymentStatus: isUdhar ? 'udhar' : 'pending',
//       isUdhar,
//       udharDueDate,
//       udharNote: udharNote || '',
//       status: 'pending'
//     });

//     await Shop.findByIdAndUpdate(cart.shopId, {
//       $inc: { totalOrders: 1 }
//     });

//     for (const item of cart.items) {
//       await Product.findByIdAndUpdate(item.productId, {
//         $inc: { totalSold: item.quantity, stock: -item.quantity }
//       });
//     }

//     const shop = await Shop.findById(cart.shopId);
//     sendOrderNotification(shop.ownerId, order);

//     await Cart.findOneAndDelete({ userId: req.user._id });

//     res.status(201).json({
//       success: true,
//       message: 'Order placed successfully',
//       order
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @GET /api/orders/my-orders (customer)
// const getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ userId: req.user._id })
//       .populate('shopId', 'shopName logo slug')
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @GET /api/orders/shop-orders (shop owner)
// const getShopOrders = async (req, res) => {
//   try {
//     const { status } = req.query;
//     let filter = { shopId: req.shop._id };
//     if (status) filter.status = status;

//     const orders = await Order.find(filter)
//       .populate('userId', 'name phone')
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @PUT /api/orders/:id/status (shop owner)
// const updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     const validStatus = ['pending', 'accepted', 'out_for_delivery', 'delivered', 'cancelled'];
//     if (!validStatus.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status'
//       });
//     }

//     const order = await Order.findOne({
//       _id: req.params.id,
//       shopId: req.shop._id
//     });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     order.status = status;
//     await order.save();

//     sendOrderStatusUpdate(order.userId, order);

//     res.status(200).json({
//       success: true,
//       message: `Order status updated to ${status}`,
//       order
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @GET /api/orders/:id (single order)
// const getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate('shopId', 'shopName logo phone address')
//       .populate('userId', 'name phone');

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     if (
//       order.userId._id.toString() !== req.user._id.toString() &&
//       order.shopId.toString() !== req.shop?._id?.toString()
//     ) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       order
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @PUT /api/orders/:id/cancel (customer)
// const cancelOrder = async (req, res) => {
//   try {
//     const order = await Order.findOne({
//       _id: req.params.id,
//       userId: req.user._id
//     });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     if (order.status !== 'pending') {
//       return res.status(400).json({
//         success: false,
//         message: 'Sirf pending orders cancel ho sakte hain'
//       });
//     }

//     order.status = 'cancelled';
//     await order.save();

//     for (const item of order.items) {
//       await Product.findByIdAndUpdate(item.productId, {
//         $inc: { stock: item.quantity }
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Order cancelled successfully',
//       order
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// module.exports = {
//   placeOrder,
//   getMyOrders,
//   getShopOrders,
//   updateOrderStatus,
//   getOrderById,
//   cancelOrder
// };








const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const { generateOrderId } = require('../utils/helpers');
const {
  sendOrderNotification,
  sendOrderStatusUpdate,
  sendUdharCreatedNotification,
  sendLowStockAlert
} = require('../services/notification.service');
const { createUdharFromOrder } = require('./udhar.controller');

// @POST /api/orders/place
const placeOrder = async (req, res) => {
  try {
    const { paymentMethod, deliveryAddress, udharNote } = req.body;

   if (!deliveryAddress || !deliveryAddress.fullAddress) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address required hai'
      });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart empty hai'
      });
    }

    const isUdhar = paymentMethod === 'UDHAR';

    const order = await Order.create({
      orderId: generateOrderId(),
      userId: req.user._id,
      shopId: cart.shopId,
      items: cart.items,
      productTotal: cart.totalProductPrice,
      deliveryCharge: cart.deliveryCharge,
      totalAmount: cart.totalAmount,
      deliveryAddress,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: isUdhar ? 'udhar' : 'pending',
      isUdhar,
      udharNote: udharNote || '',
      status: 'pending'
    });

    // Shop stats update
    await Shop.findByIdAndUpdate(cart.shopId, {
      $inc: { totalOrders: 1 }
    });

    // Product stock update
const shop = await Shop.findById(cart.shopId);
for (const item of cart.items) {
  const updatedProduct = await Product.findByIdAndUpdate(
    item.productId,
    { $inc: { totalSold: item.quantity, stock: -item.quantity } },
    { new: true }
  );

  // ✅ Low stock check
  if (updatedProduct && updatedProduct.stock <= 5 && updatedProduct.stock > 0) {
    sendLowStockAlert(shop.ownerId, updatedProduct);
  }
}

// Shop owner ko notification
sendOrderNotification(shop.ownerId, order);
    // Cart clear karo
    await Cart.findOneAndDelete({ userId: req.user._id });

    res.status(201).json({
      success: true,
      message: 'Order place ho gaya!',
      order
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/orders/my-orders (customer)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('shopId', 'shopName logo slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/orders/shop-orders (shop owner)
const getShopOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = { shopId: req.shop._id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/orders/:id/status (shop owner)
// ⭐ KEY CHANGE: jab accepted ho aur isUdhar true ho to auto udhar create
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatus = ['pending', 'accepted', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      shopId: req.shop._id
    }).populate('userId', 'name phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order nahi mila'
      });
    }

    order.status = status;
if (status === 'delivered' && order.paymentMethod === 'COD') {
  order.paymentStatus = 'paid';
}

if (status === 'delivered') {
  const { checkAndUpdateSubscription } = require('../services/subscription.service');
  await checkAndUpdateSubscription(order.shopId);
}

    await order.save();

    // ⭐ UDHAR AUTO CREATE LOGIC
    // Jab order accept ho aur isUdhar true ho
    if (status === 'accepted' && order.isUdhar) {
      const shop = await Shop.findById(req.shop._id);

      // Udhar entry auto create
      const udhar = await createUdharFromOrder(order, shop);

      if (udhar) {
        // Dono ko notify karo
        sendUdharCreatedNotification(
          shop.ownerId,
          order.userId._id,
          udhar,
          order
        );
      }
    }

    // Customer ko order status update
    sendOrderStatusUpdate(order.userId._id, order);

    res.status(200).json({
      success: true,
      message: `Order ${status} ho gaya!`,
      order
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/orders/:id (single order)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('shopId', 'shopName logo phone address')
      .populate('userId', 'name phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order nahi mila'
      });
    }

    // Auth check
    const isCustomer = order.userId._id.toString() === req.user._id.toString();
    const isOwner = req.shop && order.shopId._id.toString() === req.shop._id.toString();

    if (!isCustomer && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/orders/:id/cancel (customer)
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order nahi mila'
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Sirf pending orders cancel ho sakte hain'
      });
    }

    order.status = 'cancelled';
    await order.save();

    // Stock wapas karo
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order cancel ho gaya!',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getShopOrders,
  updateOrderStatus,
  getOrderById,
  cancelOrder
};