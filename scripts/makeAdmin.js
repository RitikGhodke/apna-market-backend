require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const user = await User.findOneAndUpdate(
    { phone: '9009896441' },
    { role: 'admin' },
    { new: true }
  );
  console.log('Admin ban gaya:', user?.name, user?.role);
  mongoose.disconnect();
});