const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { pick } = require('ramda');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const EncodeToken = require('../../helpers/tokenEncoder');
const Schema = mongoose.Schema;

/**
 * admin schema
 */

const AdminSchema = new Schema(
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
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true
    },
    isSuper: {
      type: Boolean,
      default: true
    },
    isLine: {
      type: Boolean,
      default: true
    },
    deleted: {
      type: Boolean,
      default: false
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
AdminSchema.pre('save', function(next) {
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

AdminSchema.method({
  // instance methods goes here
  passwordMatches(password) {
    // use bcrypt
    return bcrypt.compare(password, this.password);
  },
  transformUser() {
    let select = [
      'role',
      '_id',
      'isSuper',
      'name',
      'email',
      'phone',
      'role',
      'createdAt',
      'updatedAt'
    ];
    return pick(select, this);
  },
  // Generates admin token
  token() {
    return EncodeToken(this.email, this._id, this.isAdmin);
  }
});

/**
 * Statics
 */

AdminSchema.static({
  //get admin by id
  get(id) {
    return this.findById(id);
  },
  // static method to get admin by email
  getByEmail(email, deleted) {
    let query = { email, deleted };
    return this.findOne(query).exec();
  },
  async loginAndGenerateToken(details) {
    const { email, password } = details;

    const admin = await this.getByEmail(email, false);
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true
    };
    if (password) {
      if (admin && (await admin.passwordMatches(password))) {
        return { admin: admin.transformUser(), accessToken: admin.token() };
      }
      err.message = 'Incorrect email or password';
    }
    throw new APIError(err);
  },
  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<admin[]>}
   */
  async list(query) {
    let skip = query.skip || '0';
    let limit = query.limit || '100';
    delete query.skip;
    delete query.limit;

    return this.find({ ...query })
      .populate({
        path: 'role'
      })
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

module.exports = mongoose.model('Admin', AdminSchema);
