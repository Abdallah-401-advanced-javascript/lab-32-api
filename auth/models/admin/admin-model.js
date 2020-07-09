'use strict';
/**
 * @module admin model
 */
const Model = require('../model');
const schema = require('./admin-schema');

class Admin extends Model {
  constructor(schema) {
    super(schema);
  }
}

module.exports = new Admin(schema);

