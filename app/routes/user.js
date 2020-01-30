const router = require('express').Router();
const { celebrate: validate } = require('celebrate');
const decode = require('../middlewares/decode');
const corporateCtrl = require('../controllers/user');
const walletCtrl = require('../controllers/wallet.controller');
const transactionCtrl = require('../controllers/transaction.controller');
const voucherCtrl = require('../controllers/voucher.controller');
const validateParams = require('../validations/user');

// load requested user by userId
router.param(
  'userId',
  validate(validateParams.paramId, { abortEarly: false }),
  corporateCtrl.load
);

// API /api/v1/corporate/

router
  .route('/')
  // create coperate user
  .post(
    validate(validateParams.corporateSignup, { abortEarly: false }),
    corporateCtrl.createCorporateUser
  );

// load logged in user
router.use(decode);

// API /api/v1/corporate/me
router
  .route('/me')
  .put(
    validate(validateParams.corporateUpdate, { abortEarly: false }),
    corporateCtrl.updateCorporateUser
  );

// API /api/v1/corporate/me
router.route('/me/wallet').get(walletCtrl.getUserWallet);
// route to get user by id
router.route('/:userId').get(corporateCtrl.getACorporateUser);
// route to get user stats
router.get('/me/stats', corporateCtrl.stats);

// route to change password
router.put(
  '/me/password',
  validate(validateParams.passwordUpdate, { abortEarly: false }),
  corporateCtrl.changePassword
);
//route to create voucher
router
  .route('/me/voucher')
  .post(transactionCtrl.walletTransaction, voucherCtrl.createCorporateVoucher)
  .get(voucherCtrl.getCooporateVouchers);

module.exports = router;
