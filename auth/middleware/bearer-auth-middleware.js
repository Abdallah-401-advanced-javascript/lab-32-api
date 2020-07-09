'use strict';

const users = require('../users');
/**
 * 
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    next('User is not loggedin');
    return;
  }

  // Bearer tokenvalue
  console.log('req.headers.authorization >>>> ',req.headers.authorization);
  let bearerToken = req.headers.authorization.split(' ').pop();
  console.log('Bearer Token=====>',bearerToken);
  users.verifyToken(bearerToken)
    .then(decodedUserObject => {
      req.user = decodedUserObject;
      console.log('decodedUserObject',decodedUserObject);
      next();
    }).catch(err=> next('Protected: Invalid User Token'));
    
};