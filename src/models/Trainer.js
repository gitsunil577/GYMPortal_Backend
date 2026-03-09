const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    specialization: [{ type: String }], // e.g. ['Cardio', 'Strength', 'Yoga']
    experience: { type: Number, default: 0 }, // years
    bio: { type: String },
    profileImage: { type: String },
    schedule: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    salary: { type: Number },
    hireDate: { type: Date, default: Date.now },
    certifications: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trainer', trainerSchema);
