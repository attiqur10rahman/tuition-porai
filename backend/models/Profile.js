const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  tutorName: { type: String, default: 'My Tuition' },
  tagline: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  monthlyTarget: { type: Number, default: 0 },
  currency: { type: String, default: '৳' },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
