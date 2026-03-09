const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    duration: { type: Number, default: 60 }, // minutes
    type: {
      type: String,
      enum: ['personal_training', 'consultation', 'group_class'],
      default: 'personal_training',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
