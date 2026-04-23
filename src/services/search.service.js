const Shop = require('../models/Shop');
const Product = require('../models/Product');
const calculateDistance = require('../utils/calculateDistance');
const { calculateDeliveryCharge } = require('./delivery.service');

const searchProductsService = async (query, lat, lng) => {
  const products = await Product.find({
    name: { $regex: query, $options: 'i' },
    isAvailable: true
  }).populate('shopId', 'shopName slug logo address isOpen deliverySettings');

  let results = products.filter(p => p.shopId && p.shopId.isOpen);

  results = results.map(product => {
    const shop = product.shopId;
    let distance = null;
    let deliveryCharge = 10;

    if (lat && lng && shop.address && shop.address.location) {
      distance = calculateDistance(
        parseFloat(lat),
        parseFloat(lng),
        shop.address.location.lat,
        shop.address.location.lng
      );

      if (distance > 5) return null;

      const charge = calculateDeliveryCharge(
        distance,
        product.price,
        shop.deliverySettings.customDeliveryDiscount
      );

      deliveryCharge = charge !== null ? charge : 30;
    }

    return {
      productId: product._id,
      productName: product.name,
      price: product.price,
      unit: product.unit,
      image: product.images[0] || '',
      deliveryCharge,
      totalPrice: product.price + deliveryCharge,
      distance: distance ? parseFloat(distance.toFixed(2)) : null,
      shop: {
        _id: shop._id,
        shopName: shop.shopName,
        slug: shop.slug,
        logo: shop.logo
      }
    };
  });

  return results
    .filter(r => r !== null)
    .sort((a, b) => a.totalPrice - b.totalPrice);
};

const searchShopsService = async (query, lat, lng, category) => {
  let filter = { isActive: true };

  if (query) {
    filter.$or = [
      { shopName: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ];
  }

  if (category) filter.category = category;

  let shops = await Shop.find(filter).select(
    'shopName slug category logo banner address isOpen rating totalOrders deliverySettings themeColor'
  );

  if (lat && lng) {
    shops = shops.map(shop => {
      if (!shop.address || !shop.address.location) return null;
      const distance = calculateDistance(
        parseFloat(lat),
        parseFloat(lng),
        shop.address.location.lat,
        shop.address.location.lng
      );
      return { ...shop.toObject(), distance: parseFloat(distance.toFixed(2)) };
    });

    shops = shops
      .filter(s => s !== null && s.distance <= 5)
      .sort((a, b) => a.distance - b.distance);
  }

  return shops;
};

module.exports = { searchProductsService, searchShopsService };