/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const { isCelebrate } = require('celebrate');

const APIError = require('../helpers/APIError');
const { customErrorMessage } = require('../helpers/joiCustomError');

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
const handler = (err, req, res, next) => {
  const response = {
    statusCode: err.status,
    message: err.message || httpStatus[err.status],
    errors: err.errors,
    payload: null,
    stack: err.stack
  };
  if (process.env.NODE_ENV !== 'development') {
    delete response.stack;
  }
  // to add the status in response header, remove comment from the code below
  // res.status(err.status);
  res.json(response);
};
exports.handler = handler;

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
exports.converter = (err, req, res, next) => {
  let convertedError = err;
  if (isCelebrate(err)) {
    convertedError = new APIError({
      message: 'Invalid fields',
      status: httpStatus.BAD_REQUEST, //unprocessible entity
      errors: customErrorMessage(err.joi.details) || {},
      payload: {}
    });
  } else if (!(err instanceof APIError)) {
    convertedError = new APIError({
      message: err.message,
      status: err.status,
      stack: err.stack
    });
  }

  return handler(convertedError, req, res);
};

/**
 * 500
 */
exports[500] = function(err, req, res, next) {
  // treat as 404
  if (
    err.message &&
    (~err.message.indexOf('Not found') ||
      ~err.message.indexOf('Cast to ObjectId failed'))
  ) {
    return next();
  }
  // error page
  return handler(err, req, res);

  // res.status(500).json({ error: err.stack });
};

/**
 *
 * @param {Error} err
 * @param {} req
 * @param {*} res
 */
exports.errorHandler = (err, req, res, next) => {
  if (err) {
    const tokenError = new APIError('Unauthorized', err.status, true);
    next(tokenError);
  }
  next();
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
exports.notFound = (req, res) => {
  const err = new APIError({
    message: 'Not found',
    status: httpStatus.NOT_FOUND
  });
  return handler(err, req, res);
};
