const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  class: { type: String, required: true },
  subject: { type: String, default: '' },
  monthlyFee: { type: Number, required: true },
  schedule: [{ type: String }], // ['Sat', 'Mon', 'Wed']
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', default: null },
  phone: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  notes: { type: String, default: '' },
  joinDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Virtual: total paid (calculated from payments)
studentSchema.virtual('totalPaid');

module.exports = mongoose.model('Student', studentSchema);
