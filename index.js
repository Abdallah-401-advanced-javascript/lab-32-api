'use strict';

const mongoose = require('mongoose');
const server = require('./lib/server');
require('dotenv').config();
// const MONGODB_URI = 'mongodb://localhost:27017/class-08-db';

const mongooseOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
server.start();

