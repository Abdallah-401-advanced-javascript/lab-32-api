'use strict';

const adminMongoDB = require('../models/admin/admin-model');
/**
 * 
 * @param {enum} capability 
 */
module.exports = (capability)=> {
  return async(req, res, next) => {
    // Previous Middleware will send us the user Object
    // req.user.capabilites => includes this capability
    // if (indexOf(req.user.capabilites) != -1)
    let reading = await adminMongoDB.readId(req.user.id);
    try {
      let roles = {
        user:    ['read'],
        writers: ['read', 'create'],
        accountant: ['read', 'account'],
        admin :  ['read', 'manage','update', 'account','create', 'delete'],
      };
      
      if (roles[reading[0].role].includes(capability)) {
        next();
      } else {
        next('Access Denied');
      }
    } catch(e) {
      // report an error
      next('Invalid Login');
    }
  };

};