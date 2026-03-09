const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    time: { type: String, required: true },     // e.g. "7:00 AM"
    duration: { type: String },                  // e.g. "60 min"
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    exercises: [{ type: String }],
    capacity: { type: Number, default: 20 },
    enrolledMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    location: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

scheduleSchema.virtual('enrollmentCount').get(function () {
  return this.enrolledMembers.length;
});

scheduleSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
