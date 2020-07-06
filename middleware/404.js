'use strict';

module.exports = (req, res, next) => {
  res.status(404);
  res.send({err: 'not found'});
  // next();
};