/**
 * Module dependencies.
 */

const session = require('express-session');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const helmet = require('helmet');
const expressWinston = require('express-winston');
const cors = require('cors');

// eslint-disable-next-line no-unused-vars
const config = require('./env');
const pkg = require('../package.json');
const winstonInstance = require('./winston');
const swagger = require('./swagger');

const env = process.env.NODE_ENV || 'development';

/**
 * Expose
 */

module.exports = function(app, passport) {
  app.use(helmet());
  app.use(cors());
  // mount swagger
  swagger(app);
  // Use winston on production

  // bodyParser should be above methodOverride
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  app.use(bodyParser.json());

  // enable detailed API logging in dev env
  //comment this code to reduce api logs
  if (env === 'development') {
    app.use(morgan('dev'));
    expressWinston.responseWhitelist.push('body');
    app.use(
      expressWinston.logger({
        winstonInstance,
        meta: true, // optional: log meta data about request (defaults to true)
        msg:
          'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
        colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
      })
    );
  }
  app.use(
    methodOverride(function(req) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        const method = req.body._method;
        delete req.body._method;
        return method;
      }
    })
  );

  // cookieParser should be above session
  app.use(cookieParser());
  app.use(
    session({
      secret: pkg.name,
      proxy: true,
      resave: true,
      saveUninitialized: true
    })
  );

  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  if (process.env.NODE_ENV !== 'test') {
    // do stuffs here
    app.use(
      expressWinston.errorLogger({
        winstonInstance: winstonInstance
      })
    );
  }
};
