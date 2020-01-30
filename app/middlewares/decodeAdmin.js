const httpStatus = require('http-status');
const Admin = require('../models/admin.model');
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
    const admin = await Admin.get(sub);
    if (admin) {
      // eslint-disable-next-line require-atomic-updates
      req.sub = sub;
      // set user object in req.me
      // eslint-disable-next-line require-atomic-updates
      req.me = admin;
      return next();
    }

    return res.json(
      sendResponse(httpStatus.UNAUTHORIZED, 'Unapproved User', null)
    );
  } catch (error) {
    next(error);
  }
};
