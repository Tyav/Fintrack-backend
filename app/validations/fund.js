const { Joi } = require('celebrate');

module.exports = {
  create: {
    body: {
      title: Joi.string()
        .min(10)
        .required(),
      description: Joi.string()
        .min(10)
        .required(),
      amount: Joi.number().required()
    }
  }
};
