const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const individualRoutes = require('./individual.routes');
const corporateRoutes = require('./corporate.routes');
const authRoutes = require('./auth.routes');
const walletRoutes = require('./wallet.routes');
const transactionRoutes = require('./transaction.routes');
const voucherRoutes = require('./card.routes');
const adminRoutes = require('./admin.routes');
const forgotPasswordRoutes = require('./forgot-password.route');

router.use('/health-check', async (req, res, next) => {
  try {
    let user = await User.findById(req.body.id);
    return res.json({
      message: 'ok',
      user
    });
  } catch (error) {
    next(error);
  }
});
// mount individual user route
router.use('/individual', individualRoutes);

// mount corporate user routes
router.use('/corporate', corporateRoutes);

// mount auth routes
router.use('/auth', authRoutes);

// mount wallet routes
router.use('/wallet', walletRoutes);

// mount transaction routes
router.use('/transaction', transactionRoutes);

// mount voucher routes
router.use('/voucher', voucherRoutes);

// mount admin routes
router.use('/admin', adminRoutes);

//mount forgot password
router.use('/password', forgotPasswordRoutes);

module.exports = router;
