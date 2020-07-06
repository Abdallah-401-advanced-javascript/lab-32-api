'use strict';

const mongoose = require('mongoose');

const todo = mongoose.Schema({
  text: {type: String , default: ''},
  difficulty : {type: Number , default: 1},
  complete: {type: Boolean, default: 0},
  assignee: {type: String , default: '' },
});

module.exports = mongoose.model('todo', todo);
// mongo shell CLI : products collection