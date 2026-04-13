const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  amount: { type: Number, required: true },
  month: { type: Number, required: true }, // 1-12
  year: { type: Number, required: true },
  note: { type: String, default: '' },
  paymentDate: { type: Date, default: Date.now },
  type: { type: String, enum: ['regular', 'advance', 'partial'], default: 'regular' },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
