const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
// eslint-disable-next-line no-unused-vars
const { encodeSignupOtp, decodeOtp } = require('../../helpers/otpEncoder');
const APIError = require('../../helpers/APIError');

const VerificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  token: {
    type: String,
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
VerificationSchema.statics = {
  /**
   * - returns the forgot-password object using the users email
   * returns a forgot-password record of an ```email```
   * @param {string} email
   */
  async get(_id) {
    const forgotPass = await this.findOne({ _id })
      .populate('user')
      .exec();
    return forgotPass;
  }
};

/**
 * Instance methods
 */
VerificationSchema.method({
  generateToken() {
    return encodeSignupOtp(this.email, this._id);
  },
  async checkToken(token) {
    const isValidToken = await bcrypt.compare(token, this.token);
    console.log(isValidToken);
    if (!isValidToken) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: 'Token is invalid'
      });
    }
    return isValidToken;
  }
});
module.exports = mongoose.model('Validation', VerificationSchema);
