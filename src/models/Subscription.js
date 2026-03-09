const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'expired', 'cancelled', 'pending'], default: 'active' },
    amountPaid: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cash', 'card', 'bank_transfer', 'online'], default: 'cash' },
    notes: { type: String },
  },
  { timestamps: true }
);

// Auto-expire subscriptions
subscriptionSchema.virtual('isExpired').get(function () {
  return this.endDate < new Date();
});

subscriptionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
