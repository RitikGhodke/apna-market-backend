// const Product = require('../models/Product');
// const Shop = require('../models/Shop');

// // @POST /api/products/add
// const addProduct = async (req, res) => {
//   try {
//     const { name, category, price, stock, description, unit } = req.body;

//     if (!name || !category || !price) {
//       return res.status(400).json({
//         success: false,
//         message: 'Name, category and price are required'
//       });
//     }

//     const product = await Product.create({
//       shopId: req.shop._id,
//       name,
//       category,
//       price,
//       stock: stock || 0,
//       description,
//       unit: unit || 'piece'
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Product added successfully',
//       product
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @GET /api/products/my-products
// const getMyProducts = async (req, res) => {
//   try {
//     const products = await Product.find({ shopId: req.shop._id })
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: products.length,
//       products
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @GET /api/products/shop/:shopId
// const getShopProducts = async (req, res) => {
//   try {
//     const { shopId } = req.params;
//     const { category } = req.query;

//     let filter = { shopId, isAvailable: true };
//     if (category) filter.category = category;

//     const products = await Product.find(filter).sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: products.length,
//       products
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @PUT /api/products/:id
// const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findOne({
//       _id: req.params.id,
//       shopId: req.shop._id
//     });

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       });
//     }

//     const { name, category, price, stock, description, unit, isAvailable } = req.body;

//     if (name) product.name = name;
//     if (category) product.category = category;
//     if (price) product.price = price;
//     if (stock !== undefined) product.stock = stock;
//     if (description) product.description = description;
//     if (unit) product.unit = unit;
//     if (isAvailable !== undefined) product.isAvailable = isAvailable;

//     await product.save();

//     res.status(200).json({
//       success: true,
//       message: 'Product updated successfully',
//       product
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @DELETE /api/products/:id
// const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findOne({
//       _id: req.params.id,
//       shopId: req.shop._id
//     });

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       });
//     }

//     await product.deleteOne();

//     res.status(200).json({
//       success: true,
//       message: 'Product deleted successfully'
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @PUT /api/products/:id/toggle
// const toggleProduct = async (req, res) => {
//   try {
//     const product = await Product.findOne({
//       _id: req.params.id,
//       shopId: req.shop._id
//     });

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       });
//     }

//     product.isAvailable = !product.isAvailable;
//     await product.save();

//     res.status(200).json({
//       success: true,
//       message: `Product ${product.isAvailable ? 'activated' : 'deactivated'}`,
//       product
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// module.exports = {
//   addProduct,
//   getMyProducts,
//   getShopProducts,
//   updateProduct,
//   deleteProduct,
//   toggleProduct
// };












const Product = require('../models/Product');
const Shop = require('../models/Shop');
const { sendLowStockAlert } = require('../services/notification.service');

// @POST /api/products/add
const addProduct = async (req, res) => {
  try {
    const { name, category, price, stock, description, unit } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name, category and price are required'
      });
    }

    const product = await Product.create({
      shopId: req.shop._id,
      name,
      category,
      price,
      stock: stock || 0,
      description,
      unit: unit || 'piece'
    });

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/products/my-products
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ shopId: req.shop._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/products/shop/:shopId
const getShopProducts = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { category } = req.query;

    let filter = { shopId, isAvailable: true };
    if (category) filter.category = category;

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/products/:id — Single product detail (Amazon style)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('shopId', 'shopName slug logo category deliverySettings rating totalOrders isOpen');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      shopId: req.shop._id
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.body.existingImages !== undefined) {
  product.images = req.body.existingImages;
}
    const { name, category, price, stock, description, unit, isAvailable } = req.body;

    if (name) product.name = name;
    if (category) product.category = category;
    if (price) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (description) product.description = description;
    if (unit) product.unit = unit;
    if (isAvailable !== undefined) product.isAvailable = isAvailable;

    await product.save();

    if (product.stock <= 5 && product.stock > 0) {
  const shop = await Shop.findById(product.shopId);
  if (shop) sendLowStockAlert(shop.ownerId, product);
}

    res.status(200).json({ success: true, message: 'Product updated successfully', product });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      shopId: req.shop._id
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();

    res.status(200).json({ success: true, message: 'Product deleted successfully' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/products/:id/toggle
const toggleProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      shopId: req.shop._id
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.isAvailable = !product.isAvailable;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${product.isAvailable ? 'activated' : 'deactivated'}`,
      product
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/products/featured — Shop owner feed ke liye 2 products choose kare
// Body: { productIds: [id1, id2], offers: { id1: 10, id2: 20 } }  (offer in % optional)
const setFeaturedProducts = async (req, res) => {
  try {
    const { productIds, offers } = req.body; // offers = { "productId": discountPercent }
    const shopId = req.shop._id;

    if (!productIds || productIds.length > 2) {
      return res.status(400).json({
        success: false,
        message: 'Sirf 2 products featured kar sakte ho'
      });
    }

    // Pehle sab products ka featured + offer reset karo
    await Product.updateMany(
      { shopId },
      { isFeatured: false, offerPercent: 0, offerPrice: null }
    );

    // Selected products ke liye featured + offer set karo
    for (const pid of productIds) {
      const product = await Product.findOne({ _id: pid, shopId });
      if (!product) continue;

      product.isFeatured = true;

      // Agar offer diya hai to calculate karo
      const discount = offers?.[pid];
      if (discount && discount > 0 && discount < 100) {
        product.offerPercent = discount;
        product.offerPrice = Math.round(product.price - (product.price * discount) / 100);
      } else {
        product.offerPercent = 0;
        product.offerPrice = null;
      }

      await product.save();
    }

    res.json({ success: true, message: 'Featured products update ho gaye!' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/products/featured/:shopId — Feed mein featured products lao
const getFeaturedByShop = async (req, res) => {
  try {
    const products = await Product.find({
      shopId: req.params.shopId,
      isFeatured: true,
      isAvailable: true
    }).limit(2);

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addProduct,
  getMyProducts,
  getShopProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleProduct,
  setFeaturedProducts,
  getFeaturedByShop
};