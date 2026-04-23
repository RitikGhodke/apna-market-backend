// const Shop = require('../models/Shop');
// const Product = require('../models/Product');
// const calculateDistance = require('../utils/calculateDistance');
// const { calculateDeliveryCharge } = require('../services/delivery.service');

// // @GET /api/search/shops?q=sharma&lat=23.25&lng=77.41
// // const searchShops = async (req, res) => {
// //   try {
// //     const { q, lat, lng, category } = req.query;

// //     let filter = { isActive: true };

// //     if (q) {
// //       filter.$or = [
// //         { shopName: { $regex: q, $options: 'i' } },
// //         { description: { $regex: q, $options: 'i' } }
// //       ];
// //     }

// //     if (category) filter.category = category;

// //     let shops = await Shop.find(filter).select(
// //       'shopName slug category logo banner address isOpen rating totalOrders deliverySettings themeColor'
// //     );

// //     // Distance calculate karo agar location diya ho
// //     if (lat && lng) {
// //       shops = shops.map(shop => {
// //         let distance = null;
// //         if (shop.address && shop.address.location) {
// //           distance = calculateDistance(
// //             parseFloat(lat),
// //             parseFloat(lng),
// //             shop.address.location.lat,
// //             shop.address.location.lng
// //           );
// //         }
// //         return {
// //           ...shop.toObject(),
// //           distance: distance ? parseFloat(distance.toFixed(2)) : null
// //         };
// //       });

// //       // Distance ke hisaab se sort karo
// //       shops = shops.filter(s => s.distance !== null && s.distance <= 5);
// //       shops.sort((a, b) => a.distance - b.distance);
// //     }

// //     res.status(200).json({
// //       success: true,
// //       count: shops.length,
// //       shops
// //     });

// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message
// //     });
// //   }
// // };


// const searchShops = async (req, res) => {
//   try {
//     const { q, lat, lng, category } = req.query;

//     let filter = { isActive: true };
//     if (q) {
//       filter.$or = [
//         { shopName: { $regex: q, $options: 'i' } },
//         { description: { $regex: q, $options: 'i' } }
//       ];
//     }
//     if (category) filter.category = category;

//     let shops = await Shop.find(filter).select(
//       'shopName slug category logo banner address isOpen rating totalOrders deliverySettings themeColor'
//     );

//     // ✅ Har shop ke top 2 products fetch karo
//     const shopsWithProducts = await Promise.all(
//       shops.map(async (shop) => {
//         const products = await Product.find({ shopId: shop._id, isAvailable: true })
//           .select('name price images')
//           .limit(2);
//         return { ...shop.toObject(), products };
//       })
//     );
//     shops = shopsWithProducts; // ✅ replace karo

//     // Distance calculate karo agar location diya ho
//     if (lat && lng) {
//       shops = shops.map(shop => {
//         let distance = null;
//         if (shop.address && shop.address.location) {
//           distance = calculateDistance(
//             parseFloat(lat), parseFloat(lng),
//             shop.address.location.lat, shop.address.location.lng
//           );
//         }
//         return { ...shop, distance: distance ? parseFloat(distance.toFixed(2)) : null };
//       });
//       shops = shops.filter(s => s.distance !== null && s.distance <= 5);
//       shops.sort((a, b) => a.distance - b.distance);
//     }

//     res.status(200).json({ success: true, count: shops.length, shops });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // @GET /api/search/products?q=shampoo&lat=23.25&lng=77.41
// const searchProducts = async (req, res) => {
//   try {
//     const { q, lat, lng } = req.query;

//     if (!q) {
//       return res.status(400).json({
//         success: false,
//         message: 'Search query required'
//       });
//     }

//     // Products search karo
//     const products = await Product.find({
//       name: { $regex: q, $options: 'i' },
//       isAvailable: true
//     }).populate('shopId', 'shopName slug logo address isOpen deliverySettings');

//     // Open shops ke products filter karo
//     let results = products.filter(p => p.shopId && p.shopId.isOpen);

//     // Har product ke saath delivery charge calculate karo
//     results = results.map(product => {
//       const shop = product.shopId;
//       let distance = null;
//       let deliveryCharge = 10; // default

//       if (lat && lng && shop.address && shop.address.location) {
//         distance = calculateDistance(
//           parseFloat(lat),
//           parseFloat(lng),
//           shop.address.location.lat,
//           shop.address.location.lng
//         );

//         if (distance > 5) return null; // Range se bahar

//         const charge = calculateDeliveryCharge(
//           distance,
//           product.price,
//           shop.deliverySettings.customDeliveryDiscount
//         );

//         deliveryCharge = charge !== null ? charge : 30;
//       }

//       return {
//         productId: product._id,
//         productName: product.name,
//         price: product.price,
//         unit: product.unit,
//         image: product.images[0] || '',
//         deliveryCharge,
//         totalPrice: product.price + deliveryCharge,
//         distance: distance ? parseFloat(distance.toFixed(2)) : null,
//         shop: {
//           _id: shop._id,
//           shopName: shop.shopName,
//           slug: shop.slug,
//           logo: shop.logo
//         }
//       };
//     });

//     // Null filter karo
//     results = results.filter(r => r !== null);

//     // Total price ke hisaab se sort karo (sabse sasta pehle)
//     results.sort((a, b) => a.totalPrice - b.totalPrice);

//     res.status(200).json({
//       success: true,
//       query: q,
//       count: results.length,
//       results
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @GET /api/search/nearby?lat=23.25&lng=77.41&category=kirana
// const getNearbyShops = async (req, res) => {
//   try {
//     const { lat, lng, category } = req.query;

//     if (!lat || !lng) {
//       return res.status(400).json({
//         success: false,
//         message: 'Location required'
//       });
//     }

//     let filter = { isActive: true, isOpen: true };
//     if (category) filter.category = category;

//     let shops = await Shop.find(filter).select(
//       'shopName slug category logo banner address isOpen rating totalOrders deliverySettings themeColor'
//     );

//     // ✅ Products fetch karo
//     const shopsWithProducts = await Promise.all(
//       shops.map(async (shop) => {
//         const products = await Product.find({ shopId: shop._id, isAvailable: true })
//           .select('name price images')
//           .limit(2);
//         return { ...shop.toObject(), products };
//       })
//     );
//     shops = shopsWithProducts;

//     // Distance calculate karo
//     shops = shops.map(shop => {
//       if (!shop.address || !shop.address.location) return null;

//       const distance = calculateDistance(
//         parseFloat(lat),
//         parseFloat(lng),
//         shop.address.location.lat,
//         shop.address.location.lng
//       );

//       return {
//         ...shop,
//         distance: parseFloat(distance.toFixed(2))
//       };
//     });

//     // Filter aur sort
//     shops = shops
//       .filter(s => s !== null && s.distance <= 5)
//       .sort((a, b) => a.distance - b.distance);

//     res.status(200).json({
//       success: true,
//       count: shops.length,
//       shops
//     });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = { searchShops, searchProducts, getNearbyShops };











const Shop = require('../models/Shop');
const Product = require('../models/Product');
const calculateDistance = require('../utils/calculateDistance');
const { calculateDeliveryCharge } = require('../services/delivery.service');

// Helper — shop ke featured products lao, fallback normal products
const getShopProducts = async (shopId) => {
  // Pehle featured products try karo
  let products = await Product.find({
    shopId,
    isAvailable: true,
    isFeatured: true
  })
    .select('name price images offerPercent offerPrice isFeatured')
    .limit(2);

  // Agar featured nahi hain to normal products dikhao
  if (products.length === 0) {
    products = await Product.find({ shopId, isAvailable: true })
      .select('name price images offerPercent offerPrice isFeatured')
      .limit(2);
  }

  return products;
};

// @GET /api/search/shops?q=sharma&lat=23.25&lng=77.41
const searchShops = async (req, res) => {
  try {
    const { q, lat, lng, category } = req.query;

    let filter = { isActive: true };
    if (q) {
      filter.$or = [
        { shopName: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    if (category) filter.category = category;

    let shops = await Shop.find(filter).select(
      'shopName slug category logo banner address isOpen rating totalOrders deliverySettings themeColor'
    );

    // Har shop ke featured products fetch karo
    const shopsWithProducts = await Promise.all(
      shops.map(async (shop) => {
        const products = await getShopProducts(shop._id);
        return { ...shop.toObject(), products };
      })
    );
    shops = shopsWithProducts;

    // Distance calculate karo agar location diya ho
    if (lat && lng) {
      shops = shops.map(shop => {
        let distance = null;
        if (shop.address && shop.address.location) {
          distance = calculateDistance(
            parseFloat(lat), parseFloat(lng),
            shop.address.location.lat, shop.address.location.lng
          );
        }
        return { ...shop, distance: distance ? parseFloat(distance.toFixed(2)) : null };
      });
      shops = shops.filter(s => s.distance !== null && s.distance <= 5);
      shops.sort((a, b) => a.distance - b.distance);
    }

    res.status(200).json({ success: true, count: shops.length, shops });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/search/products?q=shampoo&lat=23.25&lng=77.41
const searchProducts = async (req, res) => {
  try {
    const { q, lat, lng } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query required'
      });
    }

    const products = await Product.find({
      name: { $regex: q, $options: 'i' },
      isAvailable: true
    }).populate('shopId', 'shopName slug logo address isOpen deliverySettings');

    let results = products.filter(p => p.shopId && p.shopId.isOpen);

    results = results.map(product => {
      const shop = product.shopId;
      let distance = null;
      let deliveryCharge = 10;

      if (lat && lng && shop.address && shop.address.location) {
        distance = calculateDistance(
          parseFloat(lat), parseFloat(lng),
          shop.address.location.lat, shop.address.location.lng
        );

        if (distance > 5) return null;

        const charge = calculateDeliveryCharge(
          distance,
          product.price,
          shop.deliverySettings.customDeliveryDiscount
        );

        deliveryCharge = charge !== null ? charge : 30;
      }

      // Offer price use karo agar hai
      const finalPrice = product.offerPrice || product.price;

      return {
        productId: product._id,
        productName: product.name,
        price: product.price,
        offerPrice: product.offerPrice || null,
        offerPercent: product.offerPercent || 0,
        finalPrice,
        unit: product.unit,
        image: product.images[0] || '',
        deliveryCharge,
        totalPrice: finalPrice + deliveryCharge,
        distance: distance ? parseFloat(distance.toFixed(2)) : null,
        shop: {
          _id: shop._id,
          shopName: shop.shopName,
          slug: shop.slug,
          logo: shop.logo
        }
      };
    });

    results = results.filter(r => r !== null);
    results.sort((a, b) => a.totalPrice - b.totalPrice);

    res.status(200).json({
      success: true,
      query: q,
      count: results.length,
      results
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/search/nearby?lat=23.25&lng=77.41&category=kirana
const getNearbyShops = async (req, res) => {
  try {
    const { lat, lng, category } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Location required'
      });
    }

    let filter = { isActive: true, isOpen: true };
    if (category) filter.category = category;

    let shops = await Shop.find(filter).select(
      'shopName slug category logo banner address isOpen rating totalOrders deliverySettings themeColor'
    );

    // Har shop ke featured products fetch karo
    const shopsWithProducts = await Promise.all(
      shops.map(async (shop) => {
        const products = await getShopProducts(shop._id);
        return { ...shop.toObject(), products };
      })
    );
    shops = shopsWithProducts;

    shops = shops.map(shop => {
      if (!shop.address || !shop.address.location) return null;
      const distance = calculateDistance(
        parseFloat(lat), parseFloat(lng),
        shop.address.location.lat, shop.address.location.lng
      );
      return { ...shop, distance: parseFloat(distance.toFixed(2)) };
    });

    shops = shops
      .filter(s => s !== null && s.distance <= 5)
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json({ success: true, count: shops.length, shops });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { searchShops, searchProducts, getNearbyShops };