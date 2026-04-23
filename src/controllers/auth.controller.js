const User = require('../models/User');
const Shop = require('../models/Shop');
const generateToken = require('../utils/generateToken');
const { generateSlug } = require('../utils/helpers');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
// @POST /api/auth/register
const register = async (req, res) => {
  try {
    
    const { name, phone, email, password, role } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone and password are required'
      });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already registered'
      });
    }
    
    const user = await User.create({
      name,
      phone,
      email,
      password,
      role: role || 'customer'
    });
    

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
   
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @POST /api/auth/login
const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone and password are required'
      });
    }

    const user = await User.findOne({ phone }).select('+password');
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone or password'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone or password'
      });
    }

    const token = generateToken(user._id);

    let shopData = null;
    if (user.role === 'shop') {
      shopData = await Shop.findOne({ ownerId: user._id });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role
      },
      shop: shopData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @POST /api/auth/create-shop
const createShop = async (req, res) => {
  try {
    const { shopName, category, description, phone, address, themeColor } = req.body;

    if (!shopName || !category) {
      return res.status(400).json({
        success: false,
        message: 'Shop name and category are required'
      });
    }

    const existingShop = await Shop.findOne({ ownerId: req.user._id });
    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: 'You already have a shop'
      });
    }

    let slug = generateSlug(shopName);
    const slugExists = await Shop.findOne({ slug });
    if (slugExists) {
      slug = slug + '-' + Date.now();
    }

    const shop = await Shop.create({
      ownerId: req.user._id,
      shopName,
      slug,
      category,
      description,
      phone,
      address,
      themeColor: themeColor || '#1D9E75'
    });

    await User.findByIdAndUpdate(req.user._id, { role: 'shop' });

    res.status(201).json({
      success: true,
      message: 'Shop created successfully',
      shop
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let shop = null;

    if (user.role === 'shop') {
      shop = await Shop.findOne({ ownerId: user._id });
    }

    res.status(200).json({
      success: true,
      user,
      shop
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required hai' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'Is email se koi account nahi mila' });

    // Reset token generate karo
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save({ validateBeforeSave: false });

    // Reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

    // Email bhejo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Apna Market" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🔐 Password Reset — Apna Market',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f9f9f9;border-radius:16px;">
          <h2 style="color:#111;font-size:22px;margin-bottom:8px;">Password Reset karo</h2>
          <p style="color:#555;font-size:14px;margin-bottom:24px;">Tumne password reset request ki hai. Neeche button dabao:</p>
          <a href="${resetUrl}" style="display:inline-block;background:#111;color:#fff;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:14px;">
            🔐 Reset Password
          </a>
          <p style="color:#999;font-size:12px;margin-top:24px;">Ye link 15 minutes mein expire ho jaayega.</p>
          <p style="color:#999;font-size:12px;">Agar tumne request nahi ki to ignore karo.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="color:#bbb;font-size:11px;text-align:center;">Apna Market — apnamarket.in</p>
        </div>
      `
    });

    res.status(200).json({ success: true, message: 'Reset link email pe bhej diya!' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token aur password required hai' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token invalid ya expire ho gaya' });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset ho gaya! Ab login karo.' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = { register, login, createShop, getMe, forgotPassword, resetPassword };