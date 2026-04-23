// const mongoose = require('mongoose');

// const udharSchema = new mongoose.Schema({
//   shopId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Shop',
//     required: true
//   },
//   customerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   customerName: String,
//   customerPhone: String,
//   totalAmount: {
//     type: Number,
//     default: 0
//   },
//   paidAmount: {
//     type: Number,
//     default: 0
//   },
//   remainingAmount: {
//     type: Number,
//     default: 0
//   },
//   transactions: [{
//     amount: Number,
//     type: {
//       type: String,
//       enum: ['credit', 'payment']
//     },
//     note: String,
//     date: {
//       type: Date,
//       default: Date.now
//     }
//   }]
// }, { timestamps: true });

// module.exports = mongoose.model('Udhar', udharSchema);






const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'payment'],
    required: true
  },
  // credit = udhar liya, payment = paisa diya
  note: {
    type: String,
    default: ''
  },
  // Agar order se aaya hai to orderId store hoga
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  orderDisplayId: {
    type: String,
    default: ''
  },
  // Us order ke items (easy display ke liye)
  items: [{
    name: String,
    quantity: Number,
    price: Number
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

const udharSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    default: ''
  },
  customerPhone: {
    type: String,
    default: ''
  },
  customerProfilePic: {  
  type: String,
  default: ''
},
  shopName: {
    type: String,
    default: ''
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  remainingAmount: {
    type: Number,
    default: 0
  },
  // Kitne din se udhar hai (color coding ke liye)
  lastUdharDate: {
    type: Date,
    default: Date.now
  },
  transactions: [transactionSchema]
}, { timestamps: true });

// Index for fast queries
udharSchema.index({ shopId: 1, customerId: 1 }, { unique: true });
udharSchema.index({ customerId: 1 });

module.exports = mongoose.model('Udhar', udharSchema);