'use strict';

const mongoose = require('mongoose');

const product = mongoose.Schema({
  name : {type: String},
  category: {type: String},
  price: {type: Number},
  inStock: {type: Number},
  description: {type: String},
  url:{type: String},
});

// users.methods.findSimilarType = function findSimilarType (cb) {
//   return this.model('Animal').find({ type: this.type }, cb);
// };


module.exports = mongoose.model('product', product);
// mongo shell CLI : categoriess collection