const httpStatus = require('http-status');
const Fund = require('../models/Fund');
const APIError = require('../../helpers/APIError');
const sendResponse = require('../../helpers/sendResponse');

exports.create = async (req, res, next) => {
  try {
    const fund = await Fund.create(req.body);
    await fund.save();
    res.json(sendResponse(httpStatus.CREATED, 'Request sent', fund, null));
  } catch (err) {
    next(err);
  }
};
