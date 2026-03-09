const User = require('../models/User');
const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');

exports.getAll = async (req, res) => {
  try {
    const members = await User.find({ role: 'user' })
      .populate('currentPlan', 'name price durationLabel')
      .sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const member = await User.findById(req.params.id).populate('currentPlan');
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { role, password, ...allowed } = req.body;
    const member = await User.findByIdAndUpdate(req.params.id, allowed, {
      new: true,
      runValidators: true,
    }).populate('currentPlan', 'name price durationLabel');
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.assignPlan = async (req, res) => {
  try {
    const { planId, paymentMethod } = req.body;
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    await Subscription.updateMany(
      { member: req.params.id, status: 'active' },
      { status: 'cancelled' }
    );

    const subscription = await Subscription.create({
      member: req.params.id,
      plan: planId,
      startDate,
      endDate,
      amountPaid: plan.price,
      paymentMethod: paymentMethod || 'cash',
    });

    const member = await User.findByIdAndUpdate(
      req.params.id,
      { currentPlan: planId, subscriptionStart: startDate, subscriptionEnd: endDate },
      { new: true }
    ).populate('currentPlan');

    res.json({ member, subscription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const member = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const member = await User.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
