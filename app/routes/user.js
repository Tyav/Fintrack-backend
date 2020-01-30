const router = require('express').Router();
const { celebrate: validate } = require('celebrate');
const decode = require('../middlewares/decode');
const userCtrl = require('../controllers/user');
const validateParams = require('../validations/user');

// load requested user by userId
router.param(
  'userId',
  validate(validateParams.paramId, { abortEarly: false }),
  userCtrl.load
);

// API /api/v1/user/

// router
//   .route('/')
//   .post(
//     validate(validateParams.userSignup, { abortEarly: false }),
//     userCtrl.createUser
//   );

// load logged in user
router.use(decode);

// API /api/v1/user/me
router
  .route('/me')
  .put(
    validate(validateParams.Update, { abortEarly: false }),
    userCtrl.updateUser
  );

// route to get user by id
router.route('/:userId').get(userCtrl.getAUser);
// route to get user stats

// route to change password
router.put(
  '/me/password',
  validate(validateParams.passwordUpdate, { abortEarly: false }),
  userCtrl.changePassword
);

module.exports = router;
