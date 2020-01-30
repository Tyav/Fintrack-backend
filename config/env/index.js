/**
 * Expose
 */

const { Joi } = require('celebrate');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();
// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number().default(6060),
  MONGOOSE_DEBUG: Joi.boolean().when('NODE_ENV', {
    is: Joi.string().equal('development'),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false)
  }),
  MONGODB_URL: Joi.string()
    .required()
    .description('Mongodb url for development'),
  MONGODB_TEST_URL: Joi.string()
    .required()
    .description('Mongodb url for test'),
  JWT_SECRET: Joi.string()
    .required()
    .description('JWT Secret required to sign'),
  JWT_EXPIRATION_INTERVAL: Joi.string()
    .required()
    .description('JWT_EXPIRATION_INTERVAL required to sign'),
  MAIL_HOST: Joi.string()
    .required()
    .description('Mail host for sending email'),
  MAIL_PORT: Joi.number()
    .required()
    .description('Mail port for sending email'),
  MAIL_EMAIL: Joi.string().description(
    'Email address used to send mail to other email address'
  ),
  MAIL_PASS: Joi.string()
    .required()
    .description('Email password for remote access to mail.'),
  MAIL_SENDER: Joi.string()
    .required()
    .description('Babybliss info email')
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpirationInterval: envVars.JWT_EXPIRATION_INTERVAL,
  mongo: {
    host:
      process.env.NODE_ENV === 'test'
        ? envVars.MONGODB_TEST_URL
        : envVars.MONGODB_URL
  },
  mailConfig: {
    host: envVars.MAIL_HOST,
    port: envVars.MAIL_PORT,
    auth: {
      user: envVars.MAIL_EMAIL,
      pass: envVars.MAIL_PASS
    }
  },
  mailSender: envVars.MAIL_SENDER
};

module.exports = config;
