const router = require('express').Router();
const { celebrate: validate } = require('celebrate');
const forgotPasswordCtrl = require('../controllers/forgot-password');
const decodeToken = require('../middlewares/decodeToken');
const validateParams = require('../validations/auth');

// creates a log for forgot password
router.post('/forgot', forgotPasswordCtrl.create);

//verifies the authencity of the token
router.use(
  validate(validateParams.forgotPass, { abortEarly: false }),
  decodeToken
);

// resets user password
router.put('/reset', forgotPasswordCtrl.reset);

module.exports = router;
