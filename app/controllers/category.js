const httpStatus = require('http-status');
const Category = require('../models/Category');
const APIError = require('../../helpers/APIError');
const sendResponse = require('../../helpers/sendResponse');

exports.create = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.json(sendResponse(httpStatus.CREATED, 'Category created', category));
  } catch (err) {
    next(err);
  }
};
