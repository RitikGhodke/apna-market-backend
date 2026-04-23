const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shopName: {
    type: String,
    required: [true, 'Shop name is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  category: {
    type: String,
    enum: ['kirana', 'dairy', 'fruits', 'food', 'medical', 'fashion', 'electronics'],
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  logo: {
    type: String,
    default: ''
  },
  banner: {
    type: String,
    default: ''
  },
  themeColor: {
    type: String,
    default: '#1D9E75'
  },
  address: {
    fullAddress: String,
    city: String,
    pincode: String,
    location: {
      lat: Number,
      lng: Number
    }
  },
  phone: String,
  email: String,
  isOpen: {
    type: Boolean,
    default: true
  },
  closedMessage: { type: String, default: '' },
  isActive: {
    type: Boolean,
    default: true
  },
  deliverySettings: {
  deliveryEnabled: { type: Boolean, default: true },
  customDeliveryDiscount: { type: Number, default: 0 },
  maxDeliveryDistance: { type: Number, default: 5 },
  freeDeliveryAbove: { type: Number, default: 100 },   // NEW
  extendedDelivery: {                                   // NEW
    enabled: { type: Boolean, default: false },
    maxDistance: { type: Number, default: 10 },
    chargePerKm: { type: Number, default: 15 }
  },
   deliveryOffToday: { type: Boolean, default: false },      // NEW
  deliveryOffMessage: { type: String, default: '' }         // NEW
},
  domain: {
    subdomain: String,
    customDomain: String,
    domainType: {
      type: String,
      enum: ['free', 'subdomain', 'custom'],
      default: 'free'
    }
  },
  homePage: {
  featuredProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  offers: [{
    title: String,
    description: String,
    discount: Number,
    validTill: Date,
    isActive: { type: Boolean, default: true },  // NEW
    bgColor: { type: String, default: '' }        // NEW
  }],
  announcement: String
},
  rating: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  totalCustomers: {
    type: Number,
    default: 0
  },

  upiId: {
    type: String,
    default: ''
  },
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);