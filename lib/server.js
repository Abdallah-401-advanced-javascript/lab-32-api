'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const timestamp = require('../middleware/timestamp.js');

// my own Router modules
const categoriesRouter = require('../routes/pro-ca-routers');
// ERROR HANDLER
const err500 = require('../middleware/500.js');
const err404 = require('../middleware/404.js');

const app = express();

// Global MiddleWare 
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(timestamp);
// app.use(productsRouter);
app.use(categoriesRouter);


// Global ERROR MiddleWare 
app.use('*',err404); // 404
app.use(err500); //500
 
module.exports = {
  server: app,
  start: (port) => {
    const PORT = port || process.env.PORT || 3000;
    app.listen(PORT, () => { console.log(`Listening on port ${PORT}`); });
  },
};
