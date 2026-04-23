// const calculateDeliveryCharge = (distanceKm, orderAmount, customDiscount = 0) => {
//   let charge = 0;

//   if (distanceKm <= 1) {
//     if (orderAmount < 30) charge = 15;
//     else if (orderAmount < 100) charge = 5;
//     else charge = 0;

//   } else if (distanceKm <= 2) {
//     if (orderAmount < 30) charge = 20;
//     else if (orderAmount < 100) charge = 10;
//     else charge = 0;

//   } else if (distanceKm <= 3) {
//     if (orderAmount < 50) charge = 25;
//     else if (orderAmount < 150) charge = 15;
//     else charge = 0;

//   } else if (distanceKm <= 5) {
//     if (orderAmount < 70) charge = 30;
//     else if (orderAmount < 200) charge = 20;
//     else charge = 0;

//   } else {
//     return null; // Out of delivery range
//   }

//   // Apply shop's custom discount
//   charge = Math.max(0, charge - customDiscount);

//   return charge;
// };

// module.exports = { calculateDeliveryCharge };








const calculateDeliveryCharge = (distanceKm, orderAmount, shopDeliverySettings = {}) => {
  const {
    customDiscount = 0,
    freeDeliveryAbove = 0,
    extendedDelivery = { enabled: false, maxDistance: 10, chargePerKm: 15 }
  } = shopDeliverySettings;

  // Shop owner ka custom free delivery threshold
  if (freeDeliveryAbove > 0 && orderAmount >= freeDeliveryAbove) {
    return 0;
  }

  let charge = 0;

  if (distanceKm <= 1) {
    if (orderAmount < 50) charge = 15;
    else if (orderAmount < 200) charge = 10;
    else charge = 5;

  } else if (distanceKm <= 2) {
    if (orderAmount < 50) charge = 20;
    else if (orderAmount < 200) charge = 15;
    else charge = 8;

  } else if (distanceKm <= 3) {
    if (orderAmount < 50) charge = 25;
    else if (orderAmount < 200) charge = 20;
    else charge = 10;

  } else if (distanceKm <= 5) {
    if (orderAmount < 50) charge = 35;
    else if (orderAmount < 200) charge = 25;
    else charge = 15;

  } else {
    // 5km ke baad — extended delivery
    if (extendedDelivery?.enabled && distanceKm <= extendedDelivery.maxDistance) {
      charge = Math.round(distanceKm * extendedDelivery.chargePerKm);
    } else {
      return null; // Out of range
    }
  }

  // Shop ka custom discount apply karo
  charge = Math.max(0, charge - customDiscount);

  return charge;
};

module.exports = { calculateDeliveryCharge };