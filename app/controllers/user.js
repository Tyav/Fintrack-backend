const httpStatus = require('http-status');
const otpGen = require('otp-generator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const sendResponse = require('../../helpers/sendResponse');
const APIError = require('../../helpers/APIError');
const Validation = require('../models/Verification');

// load a user into req.user from the ID
exports.load = async (req, res, next, id) => {
  try {
    // get user by id
    let user = await User.get(id);
    if (user) {
      // set user in req object
      req.user = user;
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

// returns a single user by a given ID
exports.getAUser = async (req, res, next) => {
  try {
    //get user from the req object
    const user = req.user;
    res.json(sendResponse(httpStatus.OK, 'Success', user.transformUser()));
  } catch (error) {
    // incase of an unforeseen error
    const { message } = error.message;
    next(
      new APIError({
        message
      })
    );
  }
};

// returns current user by a given token
exports.getCurrentUser = async (req, res, next) => {
  try {
    //get user from the req object
    const user = req.me;
    res.json(sendResponse(httpStatus.OK, 'Success', user.transformUser()));
  } catch (error) {
    // incase of an unforeseen error
    next(
      new APIError({
        message: 'Not found',
        status: httpStatus.NOT_FOUND
      })
    );
  }
};

// get all users
exports.getAll = async (req, res, next) => {
  try {
    // protected for only admins
    if (!req.me.isAdmin) {
      return res.json(sendResponse(httpStatus.OK, 'Success', []));
    }
    // query needs more checks
    let users = await User.list(req.query);
    res.json(sendResponse(httpStatus.OK, 'Success', users));
  } catch (error) {
    next(error);
  }
};

// update user data. email can not be update, password will be updated seperately.
exports.updateUser = async (req, res, next) => {
  try {
    const user = req.me;
    // using distructing to get updated information.
    const { name, phone } = { ...req.me, ...req.body };
    user.name = name || user.name;
    user.phone = phone || user.phone;
    await user.save();
    res.json(
      sendResponse(httpStatus.OK, 'Update successful', user.transformUser())
    );
  } catch (error) {
    next(error);
  }
};

// get statistics for a corporate user
exports.stats = async (req, res, next) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const user = req.me;
    // implimentation to get total request goes here

    res.json(
      sendResponse(httpStatus.OK, 'Successful', {
        claims: 5,
        request: 10
      })
    );
  } catch (error) {
    next(error);
  }
};

// change password
exports.changePassword = async (req, res, next) => {
  try {
    const user = req.me;
    // check password.
    const { oldPassword, newPassword } = req.body;
    if (!(await user.passwordMatches(oldPassword))) {
      throw new APIError({
        message: 'Wrong password',
        status: httpStatus.BAD_REQUEST
      });
    }
    user.password = newPassword;
    await user.save();
    res.json(
      sendResponse(
        httpStatus.OK,
        'Password changed successfully',
        user.transformUser()
      )
    );
  } catch (error) {
    next(error);
  }
};

// create user
exports.createUser = async (req, res, next) => {
  try {
    // check for user email
    const userExist = await User.getByEmail(req.body.email);
    if (userExist) {
      return res.json(
        sendResponse(httpStatus.BAD_REQUEST, 'User exist', null, {
          message: 'User exist'
        })
      );
    }

    // create signup token and send to user to validate signup
    let otp = otpGen.generate(6, {
      specialChars: false
    });
    const user = new User(req.body);
    await user.save();
    // create validation object
    let token = await bcrypt.hash(otp, 10);
    //set expiration for token
    const expireAt = Date.now() + 300000;
    const validation = await Validation.create({
      user: user._id,
      token,
      expireAt
    });
    token = validation.generateToken();
    user.sendVerification(otp);
    return res.json(
      sendResponse(
        httpStatus.CREATED,
        'Verification Token sent to email',
        null,
        null,
        token
      )
    );
  } catch (err) {
    next(err);
  }
};
