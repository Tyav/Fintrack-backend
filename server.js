'use strict';
/**
 * Module dependencies
 */

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config/env');
//require('./seed');

const port = process.env.PORT || 3000;

const app = express();
const connection = connect();

/**
 * Expose
 */

module.exports = {
  app,
  connection
};

// Bootstrap routes
require('./config/passport')(passport);
require('./config/express')(app, passport);
require('./config/routes')(app, passport);

connection
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', listen);

function listen() {
  // if (app.get('env') === 'test') return;
  if (process.env.NODE_ENV !== 'test') {
    app.listen(port);
    console.log('Express app started on port ' + port);
  }
}

function connect() {
  var options = {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  };
  mongoose.connect(config.mongo.host, options);
  return mongoose.connection;
}
