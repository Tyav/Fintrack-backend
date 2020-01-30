const router = require('express').Router();
const { celebrate: validate } = require('celebrate');
const decode = require('../middlewares/decodeAdmin');
const validateParams = require('../validations/admin');
const adminCtrl = require('../controllers/admin');

// load logged in user
router.use(decode);

// Login corporate users
router.post(
  '/create',
  validate(validateParams.createAdmin, { abortEarly: false }),
  adminCtrl.createAdmin
);
// approve user account
router.put('/approve_user', adminCtrl.approveUser);

// view all user
router.get('/users', adminCtrl.getAllUser);

// view all vouchers
router.get('/vouchers', adminCtrl.getAllVouchers);

module.exports = router;
