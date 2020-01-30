const httpStatus = require('http-status');
const queryString = require('query-string');
const Admin = require('../models/admin.model');
const User = require('../models/user');
const Voucher = require('../models/voucher.model.js');
const sendResponse = require('../../helpers/sendResponse');
const APIError = require('../../helpers/APIError');
const QueryBuilder = require('../../helpers/user_query_builder');

// load a admin into req.admin from the ID
exports.load = async (req, res, next, id) => {
  try {
    // get admin by id
    let admin = await Admin.get(id);
    if (admin) {
      // set admin in req object
      req.admin = admin;
      return next();
    }
    throw new APIError({
      status: httpStatus.NOT_FOUND,
      message: 'Not Found'
    });
  } catch (error) {
    next(error);
  }
};

// create admin
exports.createAdmin = async (req, res, next) => {
  try {
    if (!req.me.isSuper) {
      throw new APIError({
        status: httpStatus.UNAUTHORIZED,
        message: 'Unauthorized'
      });
    }
    // check if admin is in the system
    let admin = await Admin.getByEmail(req.body.email);
    if (admin) {
      return res.json(
        sendResponse(httpStatus.BAD_REQUEST, 'Admin exist', null, {
          message: 'Admin exist'
        })
      );
    }
    admin = new Admin(req.body);

    await admin.save();
    // send message to verify user

    res.json(
      sendResponse(httpStatus.CREATED, 'Admin created', admin.transformUser())
    );
  } catch (error) {
    next(error);
  }
};

// approve a user by amin
exports.approveUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    user.isVerified = true;
    await user.save();
    res.json(
      sendResponse(httpStatus.OK, 'User verified', user.transformUser())
    );
  } catch (error) {
    next(error);
  }
};

// get all user
exports.getAllUser = async (req, res, next) => {
  try {
    // build query
    const queryFilter = queryString.parse(queryString.stringify(req.query), {
      parseNumbers: true,
      parseBooleans: true
    });
    const query = new QueryBuilder(queryFilter).getFilterQuery();
    const users = await User.list(query);
    res.json(sendResponse(httpStatus.OK, 'Successful', users));
  } catch (error) {
    next(error);
  }
};

