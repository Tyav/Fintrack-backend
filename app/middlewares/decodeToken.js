const httpStatus = require('http-status');
const ForgotPassword = require('../models/forgot-password');
const sendResponse = require('../../helpers/sendResponse');
const { decodeOtp } = require('../../helpers/otpEncoder');

// decode user token
module.exports = async (req, res, next) => {
  try {
    const { token } = req.body;
    const { email, id } = decodeOtp(req);
    const forgotPass = await ForgotPassword.get(email, id);
    if (forgotPass) {
      await forgotPass.checkToken(token);
      await ForgotPassword.deleteMany({ email }); //delete all existing request by the user
      // eslint-disable-next-line require-atomic-updates
      req.password = forgotPass;
      return next();
    }
    return res.json(
      sendResponse(httpStatus.UNAUTHORIZED, 'Token is invalid', null)
    );
  } catch (error) {
    next(error);
  }
};
