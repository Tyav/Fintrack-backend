/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');

const CategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  for: {
    type: String,
    enum: ['Fund', 'Claim', 'All'],
    required: true
  }
});

/**
 * static methods
 */
CategorySchema.statics = {};

/**
 * Instance methods
 */
CategorySchema.method({});

// do not export this model, it is an Example.
module.exports = mongoose.model('Category', CategorySchema);
