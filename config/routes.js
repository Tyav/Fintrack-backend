'use strict';
const routes = require('../app/routes/index');
const error = require('./error');

module.exports = function(app) {
  app.use('/api/v1', routes);

  /**
   * Error handling
   */
  // if error is not an instanceOf APIError, convert it.
  app.use(error.converter);

  // catch 404 and forward to error handler
  app.use(error.notFound);

  app.use(error[500]);

  // error handler, send stacktrace only during development
  app.use(error.handler);
};
