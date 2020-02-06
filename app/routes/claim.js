const express = require('express');
const { celebrate: validate } = require('celebrate');
const decode = require('../middlewares/decode');
const validateParams = require('../validations/claim');
const claimCtrl = require('../controllers/claim');

const router = express.Router();

// decode user
router.use(decode);

//load claims by id
router.param('id', validate(validateParams.getOne, { abortEarly: false }));
router.param('id', claimCtrl.load);

router
  .route('/')
  // create user claim request
  .post(
    validate(validateParams.create, { abortEarly: false }),
    claimCtrl.create
  )
  // get all claims
  .get(claimCtrl.getAll);

router
  .route('/:id')
  // get claiming request by id
  .get(claimCtrl.getOne);

module.exports = router;
