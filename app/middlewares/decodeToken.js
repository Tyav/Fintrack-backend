const httpStatus = require('http-status');
const ForgotPassword = require('../models/forgot-password');
const sendResponse = require('../../helpers/sendResponse');
const { decodeOtp } = require('../../helpers/otpEncoder');

// decode user token
module.exports = async (req, res, next) => {
  try {
    const { email, id, token } = decodeOtp(req, res);
    const forgotPass = await ForgotPassword.get(email, id);
    await ForgotPassword.deleteMany({ email }); //delete all existing request by the user
    if (forgotPass) {
      await forgotPass.checkToken(token);
      // eslint-disable-next-line require-atomic-updates
      req.password = forgotPass;
      return next();
    }
    return res.json(
      sendResponse(httpStatus.UNAUTHORIZED, 'Expired link', null)
    );
  } catch (error) {
    next(error);
  }
};
