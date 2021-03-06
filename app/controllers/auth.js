const httpStatus = require('http-status');
const User = require('../models/user');
const Admin = require('../models/admin');
const Verification = require('../models/Verification');
const sendResponse = require('../../helpers/sendResponse');
const APIError = require('../../helpers/APIError');
const { decodeOtp } = require('../../helpers/otpEncoder');

exports.userLogin = async (req, res, next) => {
  // get user by email and  check password
  try {
    const { body } = req;
    let { user, accessToken } = await User.loginAndGenerateToken(body);
    // check password
    res.json(
      sendResponse(httpStatus.OK, 'Login successful', user, null, accessToken)
    );
  } catch (error) {
    next(error);
  }
};

exports.adminLogin = async (req, res, next) => {
  // get user by email and  check password
  try {
    const { body } = req;
    let { admin, accessToken } = await Admin.loginAndGenerateToken(body);
    // check password
    res.json(
      sendResponse(httpStatus.OK, 'Login successful', admin, null, accessToken)
    );
  } catch (error) {
    next(error);
  }
};

exports.approveUser = async (req, res, next) => {
  try {
    // get user object
    //verify token sent from user else return an invalid token here
    const user = req.me;
    if (user.isVerified) {
      // if in a case where user happens to be verified already
      throw new APIError({
        message: 'User already verified. Proceed to Login',
        status: httpStatus.BAD_REQUEST
      });
    }
    user.isVerified = true;
    await user.save();
    res.json(
      sendResponse(
        httpStatus.OK,
        'Verification successful.',
        user.transformUser(),
        null,
        user.token()
      )
    );
  } catch (error) {
    next(error);
  }
};

// verify user
exports.verifyUser = async (req, res, next) => {
  try {
    // get token from req body
    const { token } = req.body;
    //decode token for user
    const { id } = decodeOtp(req);
    //find verification token
    const verification = await Verification.get(id);
    if (!verification) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: 'Invalid token'
      });
    }
    await verification.checkToken(token);
    // get user
    console.log(verification);
    const user = verification.user;
    user.isVerified = true;
    await user.save();

    await Verification.deleteMany({ user: user._id });

    return res.json(
      sendResponse(
        httpStatus.CREATED,
        'User verified',
        user.transformUser(),
        null,
        user.token()
      )
    );
  } catch (error) {
    next(error);
  }
};
