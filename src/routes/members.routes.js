const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/members.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect, adminOnly);

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.put('/:id/plan', ctrl.assignPlan);
router.put('/:id/status', ctrl.updateStatus);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
