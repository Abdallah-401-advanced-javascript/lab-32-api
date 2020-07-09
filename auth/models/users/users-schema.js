'use strict';

const mongoose = require('mongoose');
/**
 * @module users infomation 
 */
/**
 * @property {String} username required
 * @property {String} email required 
 * @property {String} password required
 * @property {String} image required
 * @property {String} role required
 */
const users = mongoose.Schema({
  username : {type: String, required: true},
  email: { type: String, required: true},
  password: {type: String, required: true},
  image: {type: String, required: true},
  role: {type: String, required: true},
});



module.exports = mongoose.model('users', users);
