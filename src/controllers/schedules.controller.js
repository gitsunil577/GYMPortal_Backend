const Schedule = require('../models/Schedule');

exports.getAll = async (req, res) => {
  try {
    const schedules = await Schedule.find({ isActive: true })
      .populate('trainer', 'name specialization profileImage')
      .sort({ day: 1, time: 1 });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate('trainer', 'name specialization')
      .populate('enrolledMembers', 'name email');
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const schedule = await Schedule.create(req.body);
    await schedule.populate('trainer', 'name specialization');
    res.status(201).json(schedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('trainer', 'name specialization');
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    res.json(schedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    res.json({ message: 'Schedule deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
