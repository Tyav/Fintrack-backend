/**
 * Module dependencies.
 */

const { Strategy, ExtractJwt } = require('passport-jwt');
const { jwtSecret } = require('../env');
// const Strategy = require('passport-jwt').Strategy;
const User = require('../../app/models/user');

/**
 * Expose
 */
// const User = require('../models/user');

const jwtOptions = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer')
};

const jwt = async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

exports.jwt = new Strategy(jwtOptions, jwt);

// exports.login = new Strategy(
//   {
//     usernameField: 'email',
//     passwordField: 'password'
//   },
//   function(email, password, done) {
//     const options = {
//       criteria: { email: email }
//     };
//     User.load(options, function(err, user) {
//       if (err) return done(err);
//       if (!user) {
//         return done(null, false, { message: 'Unknown user' });
//       }
//       if (!user.authenticate(password)) {
//         return done(null, false, { message: 'Invalid password' });
//       }
//       return done(null, user);
//     });
//   }
// );
