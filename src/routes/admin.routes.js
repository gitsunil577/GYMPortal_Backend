const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect, adminOnly);

router.get('/stats', ctrl.getStats);
router.get('/subscriptions', ctrl.getSubscriptions);

module.exports = router;
