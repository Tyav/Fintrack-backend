const router = require('express').Router();
const { celebrate: validate } = require('celebrate');
const validateParams = require('../validations/auth');
const authController = require('../controllers/auth');
const decode = require('../middlewares/decode');

// Login corporate users
router.post(
  '/user_login',
  validate(validateParams.login, { abortEarly: false }),
  authController.corporateLogin
);

// Login admin designated users
router.post(
  '/admin_login',
  validate(validateParams.login, { abortEarly: false }),
  authController.adminLogin
);

router.put('/approve_user', decode, authController.approveUser);
module.exports = router;
