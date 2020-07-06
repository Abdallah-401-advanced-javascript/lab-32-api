'use strict';

const Model = require('../model');
const schema = require('./todo-schema');

class Todo extends Model {
  constructor(schema) {
    super(schema);
  }
}

module.exports = new Todo(schema);

// require it, then make instance new Todo();
// beside not doing new, use the methods directly + Singlton 