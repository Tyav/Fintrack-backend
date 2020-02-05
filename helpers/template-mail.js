// eslint-disable-next-line no-unused-vars
const client = require('../config/env');

exports.emailVerification = ({ name, token }) =>
  `<p>Hi ${name}, <br> copy the code and paste in your app to verify your account: ${token}</p>`;
exports.userOtpMail = token =>
  `<p>copy the code and paste in your app to change password: ${token}</p>`;
