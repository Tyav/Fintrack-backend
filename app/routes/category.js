const express = require('express');
const decode = require('../middlewares/decode');
const categoryCtrl = require('../controllers/category');

const router = express.Router();

router.route('/').post(categoryCtrl.create);

module.exports = router;
