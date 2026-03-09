const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true }, // in days (30 = monthly, 365 = yearly)
    durationLabel: { type: String, enum: ['monthly', 'quarterly', 'semi-annual', 'annual', 'custom'], default: 'monthly' },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
    maxMembers: { type: Number }, // null = unlimited
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plan', planSchema);
