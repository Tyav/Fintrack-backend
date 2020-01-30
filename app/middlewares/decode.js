const httpStatus = require('http-status');
const User = require('../models/user');
const sendResponse = require('../../helpers/sendResponse');
const tokendecoder = require('../../helpers/tokenDecoder');
const APIError = require('../../helpers/APIError');

// decode user token
module.exports = async (req, res, next) => {
  try {
    const { decodeToken } = tokendecoder(req, res);
    if (!decodeToken)
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: 'Token may have expired'
      });
    const { sub } = decodeToken;
    const user = await User.get(sub);
    if (user) {
      // eslint-disable-next-line require-atomic-updates
      req.sub = sub;
      // set user object in req.me
      // eslint-disable-next-line require-atomic-updates
      req.me = user;
      return next();
    }

    return res.json(
      sendResponse(httpStatus.UNAUTHORIZED, 'Unapproved User', null)
    );
  } catch (error) {
    next(error);
  }
};
