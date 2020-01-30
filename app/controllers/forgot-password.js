const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const otpGen = require('otp-generator');
const sendResponse = require('../../helpers/sendResponse');
const { userOtpMail } = require('../../helpers/template-mail');
const mail = require('../../helpers/sendMail');
const ForgotPassword = require('../models/forgot-password.model');
const User = require('../models/user');

/**
 * - Controller to create forgot password object
 */
exports.create = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userType = req.userType;
    const user = await User.getByEmail(email, true);
    if (!user) {
      // send success response even if user does not exist but don't send mail
      return res.json(
        sendResponse(
          httpStatus.NOT_FOUND,
          'Email containing token sent, check your mail',
          null
        )
      );
    }
    //generate token and hash it
    let otp = otpGen.generate(6, {
      specialChars: false,
      alphabets: false,
      upperCase: false
    });
    let token = await bcrypt.hash(otp, 10);
    //set expiration for token
    const expireAt = Date.now() + 300000;
    const newForgotPass = await ForgotPassword({
      email: user.email,
      token,
      expireAt,
      userType: !userType ? 'User' : 'Admin'
    });
    await newForgotPass.save();

    //create mail body if enviroment is not test

    const mailBody = userOtpMail(otp);
    //create mail and send
    mail(user.email, 'OTP for password change', mailBody);

    return res.json(
      sendResponse(
        httpStatus.OK,
        'Email containing token sent, check your mail',
        null, null, newForgotPass.generateToken(otp)
      )
    );
  } catch (error) {
    next(error);
  }
};

exports.reset = async (req, res, next) => {
  try {
    // add validation for reset password,need to check for token
    const { email } = req.password;
    const { password, token } = req.body;
    password.checkToken(token)
    const user = await User.getByEmail(email, true);
    user.password = password;
    await user.save();
    return res.json(
      sendResponse(httpStatus.OK, 'Password change successfully')
    );
  } catch (error) {
    next(error);
  }
};
