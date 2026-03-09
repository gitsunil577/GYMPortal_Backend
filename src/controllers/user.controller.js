const path = require('path');
const User = require('../models/User');
const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const Progress = require('../models/Progress');
const Booking = require('../models/Booking');
const Trainer = require('../models/Trainer');

// ─── Profile ─────────────────────────────────────────────────────────────────

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('currentPlan');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { role, status, password, ...allowed } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, allowed, {
      new: true,
      runValidators: true,
    }).populate('currentPlan');
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const imageUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: imageUrl },
      { new: true }
    ).populate('currentPlan');
    res.json({ profileImage: imageUrl, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Subscription ─────────────────────────────────────────────────────────────

exports.subscribePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    if (!planId) return res.status(400).json({ message: 'planId is required' });

    const plan = await Plan.findById(planId);
    if (!plan || !plan.isActive) return res.status(404).json({ message: 'Plan not found' });

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);

    await Subscription.updateMany(
      { member: req.user._id, status: 'active' },
      { status: 'cancelled' }
    );

    const subscription = await Subscription.create({
      member: req.user._id,
      plan: plan._id,
      startDate,
      endDate,
      amountPaid: plan.price,
      paymentMethod: 'online',
      status: 'active',
    });

    await User.findByIdAndUpdate(req.user._id, {
      currentPlan: plan._id,
      subscriptionStart: startDate,
      subscriptionEnd: endDate,
    });

    res.status(201).json({ message: 'Subscription created successfully', subscription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ member: req.user._id, status: 'active' });
    if (!sub) return res.status(404).json({ message: 'No active subscription found' });

    sub.status = 'cancelled';
    await sub.save();

    await User.findByIdAndUpdate(req.user._id, {
      currentPlan: null,
      subscriptionStart: null,
      subscriptionEnd: null,
    });

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyPlan = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      member: req.user._id,
      status: 'active',
    })
      .populate('plan')
      .sort({ createdAt: -1 });

    if (!subscription) return res.json({ plan: null, subscription: null });
    res.json({ plan: subscription.plan, subscription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ member: req.user._id })
      .populate('plan', 'name durationLabel price')
      .sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Progress ─────────────────────────────────────────────────────────────────

exports.getProgress = async (req, res) => {
  try {
    const logs = await Progress.find({ member: req.user._id }).sort({ date: -1 }).limit(30);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addProgress = async (req, res) => {
  try {
    const log = await Progress.create({ ...req.body, member: req.user._id });
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProgress = async (req, res) => {
  try {
    const log = await Progress.findOneAndDelete({ _id: req.params.id, member: req.user._id });
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json({ message: 'Log deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Bookings ─────────────────────────────────────────────────────────────────

exports.getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find({ status: 'active' });
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ member: req.user._id })
      .populate('trainer', 'name specialization email phone')
      .sort({ date: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { trainerId, date, time, duration, type, notes } = req.body;
    if (!trainerId || !date || !time) {
      return res.status(400).json({ message: 'trainerId, date and time are required' });
    }
    const trainer = await Trainer.findById(trainerId);
    if (!trainer || trainer.status !== 'active') {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    const booking = await Booking.create({
      member: req.user._id,
      trainer: trainerId,
      date,
      time,
      duration: duration || 60,
      type: type || 'personal_training',
      notes,
      status: 'pending',
    });
    await booking.populate('trainer', 'name specialization email phone');
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, member: req.user._id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
