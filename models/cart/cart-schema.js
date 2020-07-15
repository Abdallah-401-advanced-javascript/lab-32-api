'use strict';

const mongoose = require('mongoose');

const cart = mongoose.Schema({
  name : {type: String, required: true},
  category: {type: String},
  price: {type: String},
  inStock: {type: String},
  description: {type: String},
  count:{type: Number},
});

// users.methods.findSimilarType = function findSimilarType (cb) {
//   return this.model('Animal').find({ type: this.type }, cb);
// };
// MONGODB_URI=mongodb://localhost:27017/class-08-db;
// MONGODB_URI=mongodb+srv://abdallah:1234@cluster0.kxzjl.mongodb.net/test?retryWrites=true&w=majority

module.exports = mongoose.model('cart', cart);
// mongo shell CLI : categoriess collection