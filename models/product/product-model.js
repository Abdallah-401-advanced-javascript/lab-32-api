'use strict';

const Model = require('../model');
const schema = require('./product-schema');

class product extends Model {
  constructor(schema) {
    super(schema);
  }
}

module.exports = new product(schema);

// require it, then make instance new Categories();
// beside not doing new, use the methods directly + Singlton 