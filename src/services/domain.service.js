const Shop = require('../models/Shop');

const updateShopDomain = async (shopId, domainType, domainValue) => {
  try {
    const shop = await Shop.findById(shopId);
    if (!shop) return { success: false, message: 'Shop not found' };

    if (domainType === 'subdomain') {
      shop.domain.subdomain = domainValue;
      shop.domain.domainType = 'subdomain';
    } else if (domainType === 'custom') {
      shop.domain.customDomain = domainValue;
      shop.domain.domainType = 'custom';
    }

    await shop.save();

    return {
      success: true,
      message: 'Domain updated',
      domain: shop.domain
    };

  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getShopUrl = (shop) => {
  if (shop.domain.domainType === 'custom' && shop.domain.customDomain) {
    return `https://${shop.domain.customDomain}`;
  } else if (shop.domain.domainType === 'subdomain' && shop.domain.subdomain) {
    return `https://${shop.domain.subdomain}.apnamarket.in`;
  }
  return `https://apnamarket.in/shop/${shop.slug}`;
};

module.exports = { updateShopDomain, getShopUrl };