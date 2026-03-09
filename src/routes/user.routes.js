const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ctrl = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

// Multer config — store in uploads/, unique filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user._id}-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

router.use(protect);

// Profile
router.get('/profile', ctrl.getProfile);
router.put('/profile', ctrl.updateProfile);
router.post('/profile/photo', upload.single('photo'), ctrl.uploadPhoto);

// Subscription
router.get('/my-plan', ctrl.getMyPlan);
router.post('/subscribe', ctrl.subscribePlan);
router.put('/subscribe/cancel', ctrl.cancelSubscription);
router.get('/payment-history', ctrl.getPaymentHistory);

// Progress
router.get('/progress', ctrl.getProgress);
router.post('/progress', ctrl.addProgress);
router.delete('/progress/:id', ctrl.deleteProgress);

// Trainer Bookings
router.get('/trainers', ctrl.getTrainers);
router.get('/bookings', ctrl.getMyBookings);
router.post('/bookings', ctrl.createBooking);
router.put('/bookings/:id/cancel', ctrl.cancelBooking);

module.exports = router;
