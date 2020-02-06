const { Joi } = require('celebrate');

module.exports = {
  create: {
    body: {
      title: Joi.string()
        .min(1)
        .required(),
      description: Joi.string()
        .min(10)
        .required(),
      amountRequested: Joi.number().required(),
      category: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/, 'id')
        .required()
    }
  },
  getOne: {
    params: {
      id: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/, 'id')
        .required()
    }
  }
};
