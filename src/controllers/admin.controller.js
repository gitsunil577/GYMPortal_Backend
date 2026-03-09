const User = require('../models/User');
const Plan = require('../models/Plan');
const Trainer = require('../models/Trainer');
const Schedule = require('../models/Schedule');
const Subscription = require('../models/Subscription');

exports.getStats = async (req, res) => {
  try {
    const [totalMembers, activeMembers, totalTrainers, totalPlans, totalSchedules, recentMembers] =
      await Promise.all([
        User.countDocuments({ role: 'user' }),
        User.countDocuments({ role: 'user', status: 'active' }),
        Trainer.countDocuments({ status: 'active' }),
        Plan.countDocuments({ isActive: true }),
        Schedule.countDocuments({ isActive: true }),
        User.find({ role: 'user' })
          .populate('currentPlan', 'name')
          .sort({ createdAt: -1 })
          .limit(5)
          .select('name email status currentPlan createdAt'),
      ]);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const revenueResult = await Subscription.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } },
    ]);
    const monthlyRevenue = revenueResult[0]?.total || 0;

    res.json({
      totalMembers,
      activeMembers,
      inactiveMembers: totalMembers - activeMembers,
      totalTrainers,
      totalPlans,
      totalSchedules,
      monthlyRevenue,
      recentMembers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate('member', 'name email phone')
      .populate('plan', 'name price durationLabel')
      .sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
