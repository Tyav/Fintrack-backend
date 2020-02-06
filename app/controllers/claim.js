const httpStatus = require('http-status');
const Claim = require('../models/Claim');
// eslint-disable-next-line no-unused-vars
const APIError = require('../../helpers/APIError');
const sendResponse = require('../../helpers/sendResponse');

// load claiming request from id
exports.load = async (req, res, next, id) => {
  try {
    const claim = await Claim.get(id);
    req.claim = claim;
    next();
  } catch (error) {
    next(error);
  }
};

// create a claims request
exports.create = async (req, res, next) => {
  try {
    // get user from the req object
    const user = req.sub;
    const claim = await Claim.create({ ...req.body, user });
    res.json(sendResponse(httpStatus.CREATED, 'Request sent', claim));
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    // get queries from query strings
    const claims = await Claim.getAll();
    res.json(sendResponse(httpStatus.OK, 'Successful', claims));
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    res.json(
      sendResponse(httpStatus.CREATED, 'claims request found', req.claim)
    );
  } catch (err) {
    next(err);
  }
};
