'use strict';

const mongoose = require('mongoose');

const todo = mongoose.Schema({
  text: {type: String},
  difficulty : {type: String},
  complete: {type: String},
  assignee: {type: String},
});

module.exports = mongoose.model('todo', todo);
// mongo shell CLI : products collection