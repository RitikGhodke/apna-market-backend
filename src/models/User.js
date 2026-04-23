// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Name is required'],
//     trim: true
//   },
//   phone: {
//     type: String,
//     required: [true, 'Phone is required'],
//     unique: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     unique: true,
//     sparse: true,
//     lowercase: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//     minlength: 6,
//     select: false
//   },
//   role: {
//     type: String,
//     enum: ['customer', 'shop'],
//     default: 'customer'
//   },
//   address: {
//     fullAddress: String,
//     city: String,
//     pincode: String,
//     location: {
//       lat: Number,
//       lng: Number
//     }
//   },
//   profilePic: {
//     type: String,
//     default: ''
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   }
// }, { timestamps: true });

// // Password hash
// userSchema.pre('save', async function() {
//   if (!this.isModified('password')) return;
//   this.password = await bcrypt.hash(this.password, 12);
// });

// // Password compare
// userSchema.methods.comparePassword = async function(enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model('User', userSchema);









const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['customer', 'shop'],
    default: 'customer'
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
  profilePic: {
    type: String,
    default: ''  // ✅ field already hai, kuch change nahi
  },
  isActive: {
    type: Boolean,
    default: true
  },

  resetPasswordToken: {
  type: String,
  default: null
},
resetPasswordExpire: {
  type: Date,
  default: null
}
}, { timestamps: true });

// Password hash
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Password compare
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);