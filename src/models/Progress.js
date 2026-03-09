const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    weight: { type: Number },        // kg
    bodyFat: { type: Number },       // %
    chest: { type: Number },         // cm
    waist: { type: Number },         // cm
    hips: { type: Number },          // cm
    workoutName: { type: String, trim: true },
    duration: { type: Number },      // minutes
    caloriesBurned: { type: Number },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', progressSchema);
