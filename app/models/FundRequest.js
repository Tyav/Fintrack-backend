/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');

const FundSchema = new mongoose.Schema({
  caterory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amountRequested: {
    type: Number,
    required: true
  },
  amountApproved: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Approved', 'Declined', 'Pending'],
    default: 'Pending'
  },
  isApproved: {
    type: Boolean,
    default: false
  }
});

/**
 * Add your
 * - pre-save hooks
 * - post-save hooks
 * - validations
 * - virtuals
 */
FundSchema.post('save', function(next) {
  /**
   * Performs operation after save
   */
  next();
});
/**
 * static methods
 */
FundSchema.statics = {};

/**
 * Instance methods
 */
FundSchema.method({});

// do not export this model, it is an Example.
module.exports = mongoose.model('Fund', FundSchema);
