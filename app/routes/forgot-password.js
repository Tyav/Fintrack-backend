const router = require('express').Router();
const { celebrate: validate } = require('celebrate');
const forgotPasswordCtrl = require('../controllers/forgot-password');
const decodeToken = require('../middlewares/decodeToken');
const validateParams = require('../validations/auth');

// creates a log for forgot password
router.post('/forgot', forgotPasswordCtrl.create);

//verifies the authencity of the token
// resets user password
router.put(
  '/reset',
  validate(validateParams.forgotPass, { abortEarly: false }),
  decodeToken,
  forgotPasswordCtrl.reset
);

module.exports = router;
