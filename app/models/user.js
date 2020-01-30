const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { pick } = require('ramda');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const EncodeToken = require('../../helpers/tokenEncoder');
const mail = require('../../helpers/sendMail');
const { emailVerification } = require('../../helpers/template-mail');

const Schema = mongoose.Schema;

/**
 * User schema
 */

const UserSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 1,
      required: true
    },
    email: {
      type: String,
      required: true,
      match: /^\w+(\.*\w+)*@decagonhq\.com$/,
      unique: true
    },
    password: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
UserSchema.pre('save', function(next) {
  /**
   * Ensures the password is hashed before save
   */
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  });
});
/**
 * Methods
 */

UserSchema.method({
  // instance methods goes here
  passwordMatches(password) {
    // use bcrypt
    return bcrypt.compare(password, this.password);
  },
  transformUser() {
    let select = [
      '_id',
      'name',
      'email',
      'phone',
      'createdAt',
      'updatedAt'
    ];
    return pick(select, this);
  },
  // Generates user token
  token() {
    return EncodeToken(this.email, this._id);
  },
  sendVerification(token) { //User sends verification token to mail
    const { email, name } = this;
    mail(email, 'Verify your email', emailVerification({ name, token }));
  }
});

/**
 * Statics
 */

UserSchema.static({
  //get user by id
  get(id) {
    return this.findById(id);
  },
  // static method to get user by email
  getByEmail(email) {
    let query = { email };
    return this.findOne(query).exec();
  },
  async loginAndGenerateToken(details) {
    const { email, password } = details;

    const user = await this.getByEmail(email, true);
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true
    };
    if (password) {
      if (user && (await user.passwordMatches(password))) {
        return { user: user.transformUser(), accessToken: user.token() };
      }
      err.message = 'Incorrect email or password';
    }
    throw new APIError(err);
  },
  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  async list(query) {
    let skip = query.skip || '0';
    let limit = query.limit || '100';
    delete query.skip;
    delete query.limit;

    return this.find({ ...query })
      .select('-password')
      .sort({
        createdAt: -1
      })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
});

/**
 * Register
 */

module.exports = mongoose.model('User', UserSchema);
