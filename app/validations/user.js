const { Joi } = require('celebrate');

module.exports = {
  // POST /api/v1/user/regularOrder
  regularOrder: {
    body: {
      individual: Joi.object()
        .keys({
          name: Joi.string().required(),
          email: Joi.string()
            .email()
            .required(),
          phone: Joi.string().required()
        })
        .required(),
      giftCards: Joi.array()
        .has(
          Joi.object()
            .keys({
              message: Joi.string().required(),
              recipient: Joi.object()
                .keys({
                  name: Joi.string().required(),
                  email: Joi.string()
                    .email()
                    .required(),
                  phone: Joi.string().required()
                })
                .required(),
              amount: Joi.number().required()
            })
            .required()
        )
        .required(),
      reference: Joi.string().required(),
      amount: Joi.number().required()
    }
  },
  corporateSignup: {
    body: {
      name: Joi.string()
        .min(2)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      phone: Joi.string().required(),
      organization: Joi.string().required(),
      password: Joi.string()
        .min(8)
        .required()
    }
  },
  paramId: {
    params: {
      userId: Joi.string()
        .regex(/[a-fA-F0-9]{24}/)
        .required()
    }
  },
  corporateUpdate: {
    body: {
      name: Joi.string().min(2),
      phone: Joi.string(), //.required(),
      organisation: Joi.string() //.required()
    }
  },
  passwordUpdate: {
    body: {
      oldPassword: Joi.string()
        .min(8)
        .required(),
      newPassword: Joi.string()
        .min(8)
        .required()
    }
  }
  //added login validation
};
