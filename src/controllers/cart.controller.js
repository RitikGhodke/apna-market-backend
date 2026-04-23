// const Cart = require('../models/Cart');
// const Product = require('../models/Product');
// const Shop = require('../models/Shop');
// const { calculateDeliveryCharge } = require('../services/delivery.service');
// const calculateDistance = require('../utils/calculateDistance');

// // @POST /api/cart/add
// const addToCart = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;

//     if (!productId || !quantity) {
//       return res.status(400).json({
//         success: false,
//         message: 'ProductId and quantity are required'
//       });
//     }

//     // Product check
//     const product = await Product.findById(productId);
//     if (!product || !product.isAvailable) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found or unavailable'
//       });
//     }

//     // Stock check
//     if (product.stock < quantity) {
//       return res.status(400).json({
//         success: false,
//         message: `Only ${product.stock} items in stock`
//       });
//     }

//     // Cart find karo ya naya banao
//     let cart = await Cart.findOne({ userId: req.user._id });

//     // Agar cart hai aur alag shop ka product add ho raha hai
//     if (cart && cart.shopId && cart.shopId.toString() !== product.shopId.toString()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cart mein sirf ek shop ke products ho sakte hain. Pehle cart clear karo.'
//       });
//     }

//     if (!cart) {
//       cart = new Cart({
//         userId: req.user._id,
//         shopId: product.shopId,
//         items: [],
//         totalProductPrice: 0,
//         deliveryCharge: 0,
//         totalAmount: 0
//       });
//     }

//     // Item already cart mein hai?
//     const existingItem = cart.items.find(
//       item => item.productId.toString() === productId
//     );

//     if (existingItem) {
//       existingItem.quantity += quantity;
//     } else {
//       cart.items.push({
//         productId: product._id,
//         name: product.name,
//         price: product.price,
//         quantity,
//         image: product.images[0] || ''
//       });
//     }

//     // Total calculate karo
//     cart.totalProductPrice = cart.items.reduce(
//       (total, item) => total + item.price * item.quantity, 0
//     );

//     // Delivery charge calculate
//     const shop = await Shop.findById(product.shopId);
//     let deliveryCharge = 0;

//     if (req.user.address && req.user.address.location && shop.address.location) {
//       const distance = calculateDistance(
//         req.user.address.location.lat,
//         req.user.address.location.lng,
//         shop.address.location.lat,
//         shop.address.location.lng
//       );

//       const charge = calculateDeliveryCharge(
//         distance,
//         cart.totalProductPrice,
//         shop.deliverySettings.customDeliveryDiscount
//       );

//       deliveryCharge = charge !== null ? charge : 30;
//     } else {
//       deliveryCharge = 10; // default
//     }

//     cart.deliveryCharge = deliveryCharge;
//     cart.totalAmount = cart.totalProductPrice + deliveryCharge;

//     await cart.save();

//     res.status(200).json({
//       success: true,
//       message: 'Item added to cart',
//       cart
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @GET /api/cart
// const getCart = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ userId: req.user._id })
//       .populate('shopId', 'shopName logo deliverySettings')
//       .populate('items.productId', 'name price images isAvailable');

//     if (!cart || cart.items.length === 0) {
//       return res.status(200).json({
//         success: true,
//         message: 'Cart is empty',
//         cart: null
//       });
//     }

//     res.status(200).json({
//       success: true,
//       cart
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @PUT /api/cart/update
// const updateCartItem = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;

//     const cart = await Cart.findOne({ userId: req.user._id });
//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: 'Cart not found'
//       });
//     }

//     const item = cart.items.find(
//       item => item.productId.toString() === productId
//     );

//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: 'Item not found in cart'
//       });
//     }

//     if (quantity <= 0) {
//       cart.items = cart.items.filter(
//         item => item.productId.toString() !== productId
//       );
//     } else {
//       item.quantity = quantity;
//     }

//     // Recalculate totals
//     cart.totalProductPrice = cart.items.reduce(
//       (total, item) => total + item.price * item.quantity, 0
//     );

//     const shop = await Shop.findById(cart.shopId);
//     let deliveryCharge = 0;

//     if (req.user.address && req.user.address.location && shop.address.location) {
//       const distance = calculateDistance(
//         req.user.address.location.lat,
//         req.user.address.location.lng,
//         shop.address.location.lat,
//         shop.address.location.lng
//       );

//       const charge = calculateDeliveryCharge(
//         distance,
//         cart.totalProductPrice,
//         shop.deliverySettings.customDeliveryDiscount
//       );

//       deliveryCharge = charge !== null ? charge : 30;
//     } else {
//       deliveryCharge = cart.items.length > 0 ? 10 : 0;
//     }

//     cart.deliveryCharge = deliveryCharge;
//     cart.totalAmount = cart.totalProductPrice + deliveryCharge;

//     await cart.save();

//     res.status(200).json({
//       success: true,
//       message: 'Cart updated',
//       cart
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @DELETE /api/cart/remove/:productId
// const removeFromCart = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ userId: req.user._id });
//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: 'Cart not found'
//       });
//     }

//     cart.items = cart.items.filter(
//       item => item.productId.toString() !== req.params.productId
//     );

//     // Recalculate
//     cart.totalProductPrice = cart.items.reduce(
//       (total, item) => total + item.price * item.quantity, 0
//     );

//     if (cart.items.length === 0) {
//       cart.shopId = null;
//       cart.deliveryCharge = 0;
//       cart.totalAmount = 0;
//     } else {
//       cart.totalAmount = cart.totalProductPrice + cart.deliveryCharge;
//     }

//     await cart.save();

//     res.status(200).json({
//       success: true,
//       message: 'Item removed from cart',
//       cart
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @DELETE /api/cart/clear
// const clearCart = async (req, res) => {
//   try {
//     await Cart.findOneAndDelete({ userId: req.user._id });

//     res.status(200).json({
//       success: true,
//       message: 'Cart cleared'
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// module.exports = {
//   addToCart,
//   getCart,
//   updateCartItem,
//   removeFromCart,
//   clearCart
// };







const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const { calculateDeliveryCharge } = require('../services/delivery.service');
const calculateDistance = require('../utils/calculateDistance');

// ─────────────────────────────────────────────
// Helper: delivery charge calculate karo
// Dono jagah (addToCart + updateCartItem) same logic use hoga
// ─────────────────────────────────────────────
const getDeliveryCharge = (user, shop, productTotal) => {
  const userLat = user?.address?.location?.lat;
  const userLng = user?.address?.location?.lng;
  const shopLat = shop?.address?.location?.lat;
  const shopLng = shop?.address?.location?.lng;

  if (userLat && userLng && shopLat && shopLng) {
    const distance = calculateDistance(userLat, userLng, shopLat, shopLng);

    const settings = shop?.deliverySettings || {};
    const extendedEnabled = settings?.extendedDelivery?.enabled;
    const maxDist = extendedEnabled
      ? (settings?.extendedDelivery?.maxDistance || 10)
      : (settings?.maxDeliveryDistance || 5);

    if (distance > maxDist) {
      return null; // Out of range
    }

    const charge = calculateDeliveryCharge(distance, productTotal, {
      customDiscount: settings?.customDeliveryDiscount || 0,
      freeDeliveryAbove: settings?.freeDeliveryAbove ?? 100,
      extendedDelivery: settings?.extendedDelivery || {}
    });

    return charge !== null ? charge : 30;
  }

  return 10; // Location missing — default
};

// @POST /api/cart/add
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'ProductId and quantity are required'
      });
    }

    // Product check
    const product = await Product.findById(productId);
    if (!product || !product.isAvailable) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable'
      });
    }

    // ✅ Shop band hai check
const shop = await Shop.findById(product.shopId);
if (!shop?.isOpen) {
  return res.status(400).json({
    success: false,
    message: shop?.closedMessage || 'Yeh shop abhi band hai — baad mein try karo'
  });
}

// ✅ Delivery band hai check  
if (shop?.deliverySettings?.deliveryOffToday) {
  return res.status(400).json({
    success: false,
    message: shop?.deliverySettings?.deliveryOffMessage || 'Aaj delivery available nahi hai'
  });
}

    // Stock check
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items in stock`
      });
    }

    // Cart find karo ya naya banao
    let cart = await Cart.findOne({ userId: req.user._id });

    // Alag shop ka product — block karo
    if (cart && cart.shopId && cart.shopId.toString() !== product.shopId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cart mein sirf ek shop ke products ho sakte hain. Pehle cart clear karo.'
      });
    }

    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        shopId: product.shopId,
        items: [],
        totalProductPrice: 0,
        deliveryCharge: 0,
        totalAmount: 0
      });
    } else {
  
  if (!cart.shopId) {
    cart.shopId = product.shopId;
  }
}

    // Item already cart mein hai?
    const existingItem = cart.items.find(
      item => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images?.[0] || ''
      });
    }

    // Product total
    cart.totalProductPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );

    // ✅ Delivery charge — helper se
   
    const deliveryCharge = getDeliveryCharge(req.user, shop, cart.totalProductPrice);

    if (deliveryCharge === null) {
      return res.status(400).json({
        success: false,
        message: `Yeh shop sirf ${shop?.deliverySettings?.maxDeliveryDistance || 5}km tak deliver karta hai. Aap range se bahar hain.`
      });
    }

    cart.deliveryCharge = deliveryCharge;
    cart.totalAmount = cart.totalProductPrice + deliveryCharge;

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      cart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @GET /api/cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate('shopId', 'shopName logo deliverySettings address')
      // .populate('items.productId', 'name price images isAvailable');

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Cart is empty',
        cart: null
      });
    }

    // ✅ Har baar getCart pe bhi delivery charge recalculate karo
    // (agar user ne baad mein location update ki ho)
    const shop = await Shop.findById(cart.shopId);
    if (shop) {
      const freshCharge = getDeliveryCharge(req.user, shop, cart.totalProductPrice);
      if (freshCharge !== null && freshCharge !== cart.deliveryCharge) {
        cart.deliveryCharge = freshCharge;
        cart.totalAmount = cart.totalProductPrice + freshCharge;
        await cart.save();
      }
    }

    res.status(200).json({
      success: true,
      cart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @PUT /api/cart/update
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const item = cart.items.find(
      item => item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        item => item.productId.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }

    // Product total
    cart.totalProductPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );

    if (cart.items.length === 0) {
      cart.shopId = null;
      cart.deliveryCharge = 0;
      cart.totalAmount = 0;
    } else {
      // ✅ Delivery charge — helper se
      const shop = await Shop.findById(cart.shopId);
      const deliveryCharge = getDeliveryCharge(req.user, shop, cart.totalProductPrice);

      // Out of range pe cart update rok nahi rahe — sirf 30 laga do
      cart.deliveryCharge = deliveryCharge !== null ? deliveryCharge : 30;
      cart.totalAmount = cart.totalProductPrice + cart.deliveryCharge;
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @DELETE /api/cart/remove/:productId
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== req.params.productId
    );

    cart.totalProductPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );

    if (cart.items.length === 0) {
      cart.shopId = null;
      cart.deliveryCharge = 0;
      cart.totalAmount = 0;
    } else {
      // ✅ Remove ke baad bhi recalculate karo
      const shop = await Shop.findById(cart.shopId);
      const deliveryCharge = getDeliveryCharge(req.user, shop, cart.totalProductPrice);
      cart.deliveryCharge = deliveryCharge !== null ? deliveryCharge : 30;
      cart.totalAmount = cart.totalProductPrice + cart.deliveryCharge;
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @DELETE /api/cart/clear
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user._id });

    res.status(200).json({
      success: true,
      message: 'Cart cleared'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
};