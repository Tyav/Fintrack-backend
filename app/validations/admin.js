const { Joi } = require('celebrate');

module.exports = {
  createAdmin: {
    body: {
      name: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(8)
        .required(),
      phone: Joi.string().required(),
      role: Joi.number()
        .min(1)
        .max(2)
        .required()
    },
    headers: Joi.object({
      authorization: Joi.string()
        .regex(/Bearer [a-zA-Z0-9]{24}/)
        .required()
    }).unknown()
  }
};
