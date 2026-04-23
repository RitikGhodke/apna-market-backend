// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   shopId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Shop',
//     required: true
//   },
//   name: {
//     type: String,
//     required: [true, 'Product name is required'],
//     trim: true
//   },
//   category: {
//     type: String,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: [true, 'Price is required']
//   },
//   stock: {
//     type: Number,
//     default: 0
//   },
//   images: [{
//     type: String
//   }],
//   description: {
//     type: String,
//     default: ''
//   },
//   unit: {
//     type: String,
//     default: 'piece'
//   },
//   isAvailable: {
//     type: Boolean,
//     default: true
//   },
//   isFeatured: {
//     type: Boolean,
//     default: false
//   },
//   totalSold: {
//     type: Number,
//     default: 0
//   }
// }, { timestamps: true });

// productSchema.index({ shopId: 1 });
// productSchema.index({ name: 'text' });

// module.exports = mongoose.model('Product', productSchema);









const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  stock: {
    type: Number,
    default: 0
  },
  images: [{
    type: String
  }],
  description: {
    type: String,
    default: ''
  },
  unit: {
    type: String,
    default: 'piece'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  // ── FEATURED ──
  isFeatured: {
    type: Boolean,
    default: false
  },
  // ── OFFER / DISCOUNT ──
  offerPercent: {
    type: Number,
    default: 0  // 0 means no offer
  },
  offerPrice: {
    type: Number,
    default: null  // calculated discounted price
  },
  totalSold: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

productSchema.index({ shopId: 1 });
productSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', productSchema);