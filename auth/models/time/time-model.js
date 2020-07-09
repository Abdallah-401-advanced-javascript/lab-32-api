'use strict';

const Model = require('../model');
const schema = require('./time-schema');
/**
 * @module time model
 */
class times extends Model {
  constructor(schema) {
    super(schema);
  }
}

module.exports = new times(schema);
