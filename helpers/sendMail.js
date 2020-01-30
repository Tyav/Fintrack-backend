const nodemailer = require('nodemailer');
const config = require('../config/env');

const sendMail = (email, subject, message) => {
  const smtpTransport = nodemailer.createTransport({
    ...config.mailConfig,
    pool: true, // use pooled connection
    rateLimit: true, // enable to make sure we are limiting
    maxConnections: 3, // set limit to 3 connection
    maxMessages: 5 // send 5 emails per second
  });
  let mailOptions = {
    to: email,
    from: config.mailSender,
    subject: subject,
    html: message
  };
  smtpTransport.sendMail(mailOptions, err => {
    if (err) {
      return new Error(err);
    }
  });
};

module.exports = sendMail;
