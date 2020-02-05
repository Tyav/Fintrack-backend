const { Joi } = require('celebrate');

module.exports = {
  // api/v1/auth/*_login
  login: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(8)
        .required()
    }
  },
  forgotPass: {
    body: {
      password: Joi.string()
        .min(8)
        .required(),
      token: Joi.string()
        .regex(/^[0-9a-zA-Z]{6}$/)
        .required()
    }
  }
  //added login validation
};
