const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
// eslint-disable-next-line no-unused-vars
const { encodeOtp, decodeOtp } = require('../../helpers/otpEncoder');
const APIError = require('../../helpers/APIError');

const ForgotPasswordSchema = new mongoose.Schema({
  email: {
    type: String,
    minlength: 5,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['User', 'Admin'],
    required: true
  },
  expireAt: {
    type: Date,
    default: Date.now() + 300000
  }
});
/**
 * static methods
 */
ForgotPasswordSchema.statics = {
  /**
   * - returns the forgot-password object using the users email
   * returns a forgot-password record of an ```email```
   * @param {string} email
   */
  async get(email, _id) {
    const forgotPass = await this.findOne({ email, _id });
    return forgotPass ? forgotPass : null;
  }
};

/**
 * Instance methods
 */
ForgotPasswordSchema.method({
  generateToken() {
    return encodeOtp(this.email, this._id);
  },
  async checkToken(token) {
    const isValidToken = await bcrypt.compare(token, this.token);
    if (!isValidToken) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: 'Token is invalid'
      });
    }
    return isValidToken;
  }
});
module.exports = mongoose.model('Forgot-password', ForgotPasswordSchema);
