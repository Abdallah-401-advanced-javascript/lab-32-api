'use strict';

const Model = require('../model');
const schema = require('./users-schema');

class users extends Model {
  constructor(schema) {
    super(schema);
  }
}

module.exports = new users(schema);

// require it, then make instance new Categories();
// beside not doing new, use the methods directly + Singlton 