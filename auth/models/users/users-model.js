'use strict';

const Model = require('../model');
const schema = require('./users-schema');
/**
 * @module users model
 */
class users extends Model {
  constructor(schema) {
    super(schema);
  }
}

module.exports = new users(schema);

