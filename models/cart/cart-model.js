'use strict';

const Model = require('../model');
const schema = require('./cart-schema');

class cart extends Model {
  constructor(schema) {
    super(schema);
  }
}

module.exports = new cart(schema);

// require it, then make instance new Categories();
// beside not doing new, use the methods directly + Singlton 