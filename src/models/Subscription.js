// const mongoose = require('mongoose');

// const subscriptionSchema = new mongoose.Schema({
//   shopId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Shop',
//     required: true
//   },
//   monthlySales: {
//     type: Number,
//     default: 0
//   },
//   isPaid: {
//     type: Boolean,
//     default: false
//   },
//   amount: {
//     type: Number,
//     default: 100
//   },
//   billingMonth: String,
//   dueDate: Date,
//   paidAt: Date
// }, { timestamps: true });

// module.exports = mongoose.model('Subscription', subscriptionSchema);









const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  billingMonth: String,
  monthSales: { type: Number, default: 0 },
  isRequired: { type: Boolean, default: false },
  isPaid: { type: Boolean, default: false },
  amount: { type: Number, default: 99 },
  paidAt: Date,
  validTill: Date,
  utrNumber: { type: String, default: '' },
  adminVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);