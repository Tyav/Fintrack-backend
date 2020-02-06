const httpStatus = require('http-status');
const Fund = require('../models/Fund');
// eslint-disable-next-line no-unused-vars
const APIError = require('../../helpers/APIError');
const sendResponse = require('../../helpers/sendResponse');

// load funding request from id
exports.load = async (req, res, next, id) => {
  try {
    const fund = await Fund.get(id);
    req.fund = fund;
    next();
  } catch (error) {
    next(error);
  }
};

// create a funding request
exports.create = async (req, res, next) => {
  try {
    // get user from the req object
    const user = req.sub;
    const fund = await Fund.create({ ...req.body, user });
    res.json(sendResponse(httpStatus.CREATED, 'Request sent', fund));
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    // get queries from query strings
    const funds = await Fund.getAll();
    res.json(sendResponse(httpStatus.OK, 'Successful', funds));
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    res.json(sendResponse(httpStatus.CREATED, 'Fund request found', req.fund));
  } catch (err) {
    next(err);
  }
};
