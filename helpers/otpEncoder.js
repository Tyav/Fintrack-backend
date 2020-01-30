const jwt = require('jwt-simple');
const moment = require('moment-timezone');
const { jwtSecret } = require('../config/env');
const httpStatus = require('http-status');
const APIError = require('./APIError');

exports.encodeOtp = (token, email, id) => {
  const payload = {
    exp: moment()
      .add(1, 'days')
      .unix(),
    iat: moment().unix(),
    token,
    email,
    id
  };
  return jwt.encode(payload, jwtSecret);
};

exports.decodeOtp = req => {
  const authorization = req.headers['authorization'];
  if (!authorization) {
    throw new APIError({
      message: 'Invalid Token',
      status: httpStatus.BAD_REQUEST
    });
  }
  let token = authorization.split(' ')[1];
  try {
    return jwt.decode(token, jwtSecret);
  } catch (error) {
    throw new APIError({
      message: 'Token may have expired',
      status: httpStatus.BAD_REQUEST
    });
  }
};
