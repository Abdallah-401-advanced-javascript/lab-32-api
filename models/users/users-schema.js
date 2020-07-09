'use strict';

const mongoose = require('mongoose');

const users = mongoose.Schema({
  username : {type: String, required: true},
  password: {type: String, required: true},
  role: {type: String, required: true},
});

// users.methods.findSimilarType = function findSimilarType (cb) {
//   return this.model('Animal').find({ type: this.type }, cb);
// };


module.exports = mongoose.model('users', users);
// mongo shell CLI : categoriess collection