'use strict';

const mongoose = require('mongoose');
/**
 * @module time 
 */
/**
 * @property {String} username required
 * @property {String} date required
 * @property {String} startTime required
 * @property {String} finishTime required
 * @property {String} workHours required
 * @property {String} location required
 * @property {String} flag 
 */

const time = mongoose.Schema({
  username: {type: String, required: true} ,
  date : {type: String, required: true} ,
  startTime : {type: String , required: true},
  finishTime : {type: String, required: true},
  workHours : {type: Number, required: true},
  location : {type: String, required: true},
  flag:{type: String},
});


module.exports = mongoose.model('time', time);
