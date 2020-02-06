const express = require('express');
const { celebrate: validate } = require('celebrate');
const decode = require('../middlewares/decode');
const validateParams = require('../validations/fund');
const fundCtrl = require('../controllers/fund');

const router = express.Router();

// decode user
router.use(decode);

//load funds by id
router.param('id', validate(validateParams.getOne, { abortEarly: false }));
router.param('id', fundCtrl.load);

router
  .route('/')
  // create user fund request
  .post(validate(validateParams.create, { abortEarly: false }), fundCtrl.create)
  // get all funds
  .get(fundCtrl.getAll);

router
  .route('/:id')
  // get funding request by id
  .get(fundCtrl.getOne);

module.exports = router;
