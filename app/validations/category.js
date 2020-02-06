const { Joi } = require('celebrate');

module.exports = {
  create: {
    body: {
      title: Joi.string().required(),
      description: Joi.string().required(),
      for: Joi.string()
        .valid('Fund', 'Claim')
        .required()
    }
  }
};
