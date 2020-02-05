const express = require('express');
const { celebrate: validate } = require('celebrate');
const decode = require('../middlewares/decode');
const validateParams = require('../validations/fund');
const fundCtrl = require('../controllers/fund');

const router = express.Router();

// decode user
router.use(decode);

router
  .route('/')
  // create user fund request
  .post(
    validate(validateParams.create, { abortEarly: false }),
    fundCtrl.create
  );

module.exports = router;
