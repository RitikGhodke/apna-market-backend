// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   orderId: {
//     type: String,
//     unique: true
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   shopId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Shop',
//     required: true
//   },
//   items: [{
//     productId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Product'
//     },
//     name: String,
//     price: Number,
//     quantity: Number,
//     image: String
//   }],
//   productTotal: Number,
//   deliveryCharge: Number,
//   totalAmount: Number,
//   status: {
//     type: String,
//     enum: ['pending', 'accepted', 'out_for_delivery', 'delivered', 'cancelled'],
//     default: 'pending'
//   },
//   deliveryAddress: {
//     fullAddress: String,
//     city: String,
//     pincode: String,
//     location: {
//       lat: Number,
//       lng: Number
//     }
//   },
//   paymentMethod: {
//     type: String,
//     enum: ['COD', 'ONLINE'],
//     default: 'COD'
//   },
//   paymentStatus: {
//     type: String,
//     enum: ['pending', 'paid', 'failed'],
//     default: 'pending'
//   },
//   razorpayOrderId: String,
//   razorpayPaymentId: String
// }, { timestamps: true });

// module.exports = mongoose.model('Order', orderSchema);






const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  productTotal: Number,
  deliveryCharge: Number,
  totalAmount: Number,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: {
    fullAddress: String,
    city: String,
    pincode: String,
    location: {
      lat: Number,
      lng: Number
    }
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'ONLINE', 'UDHAR'], // ✅ UDHAR add kiya
    default: 'COD'
  },
  paymentStatus: {
  type: String,
  enum: ['pending', 'paid', 'failed', 'udhar', 'upi_pending', 'upi_submitted'], // upi_pending + upi_submitted ADD
  default: 'pending'
},
  // ✅ Udhar details
  isUdhar: {
    type: Boolean,
    default: false
  },
  udharDueDate: {
    type: Date,
    default: null
  },
  udharNote: {
    type: String,
    default: ''
  },
  razorpayOrderId: String,
  utrNumber: {
  type: String,
  default: ''
},
  razorpayPaymentId: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);