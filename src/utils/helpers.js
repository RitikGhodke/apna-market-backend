const slugify = require('slugify');

const generateSlug = (name) => {
  return slugify(name, {
    lower: true,
    strict: true,
    trim: true
  });
};

const generateOrderId = () => {
  return 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
};

module.exports = { generateSlug, generateOrderId };