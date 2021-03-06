/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');

const ClaimSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    amountRequested: {
      type: Number,
      required: true
    },
    amountApproved: {
      type: Number
    },
    status: {
      type: String,
      enum: ['Approved', 'Declined', 'Pending'],
      default: 'Pending'
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    approvedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    }
  },
  { timestamps: true }
);

/**
 * Add your
 * - pre-save hooks
 * - post-save hooks
 * - validations
 * - virtuals
 */
ClaimSchema.post('save', function(doc, next) {
  /**
   * Performs operation after save
   */
  doc
    .populate({ path: 'user', select: '-password' })
    .populate({ path: 'category', select: 'title' })
    .execPopulate()
    .then(() => {
      next();
    });
});
ClaimSchema.post('find', async function(docs) {
  for (let doc of docs)
    await doc
      .populate({ path: 'user', select: '-password' })
      .populate({
        path: 'category',
        select: 'title'
      })
      .execPopulate();
});
/**
 * static methods
 */
ClaimSchema.statics = {
  getAll() {
    return this.find();
  },
  get(_id) {
    const fund = this.find({ _id });
    if (!fund)
      throw new APIError({
        message: 'Funding request not found',
        status: httpStatus.NOT_FOUND
      });
    return fund;
  }
};

/**
 * Instance methods
 */
ClaimSchema.method({});

// do not export this model, it is an Example.
module.exports = mongoose.model('Claim', ClaimSchema);
