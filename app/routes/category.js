const express = require('express');
const { celebrate: validate } = require('celebrate');
const decode = require('../middlewares/decode');
const validateParam = require('../validations/category');
const categoryCtrl = require('../controllers/category');

const router = express.Router();

router
  .route('/')
  .post(
    validate(validateParam.create, { abortEarly: false }),
    categoryCtrl.create
  );

module.exports = router;
