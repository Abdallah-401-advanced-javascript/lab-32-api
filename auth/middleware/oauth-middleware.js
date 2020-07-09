'use strict';

const superagent = require('superagent');
const users = require('../users');
const { v4: uuidv4 } = require('uuid');
const user = require('../models/users/users-model');
const bcrypt =require('bcrypt');
/*
  Resources
  https://docs.microsoft.com/en-gb/linkedin/
*/

const tokenServerUrl = process.env.TOKEN_SERVER;
const remoteAPI = process.env.REMOTE_API;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_SERVER = process.env.API_SERVER;

/**
 * 
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */

module.exports = async  (req, res, next)=> {
  try {    
    let code = req.query.code;
    let remoteToken = await exchangeCodeForToken(code);
    let remoteUser = await getRemoteUserInfo(remoteToken);
    let [user, token, tempUserPassword] = await getUser(remoteUser);
    req.user = user;
    req.token = token;
    req.tempUserPassword = tempUserPassword;   
    next();
  } catch (e) {
    console.log(`ERROR: ${e}`);
    next('error');
  }
};

/**
 * 
 * @param {string} code 
 */
async function exchangeCodeForToken(code) {
  let tokenResponse = await superagent.post(tokenServerUrl)
    .set('Content-Type','application/x-www-form-urlencoded')
    .send({
      code: code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: API_SERVER,
      grant_type: 'authorization_code',
    });

  let access_token = tokenResponse.body.access_token;
  console.log('returned token',access_token);
  return access_token;
}

/**
 * 
 * @param {string} token 
 */
async function getRemoteUserInfo(token) {
  let userResponse = await superagent
    .get(remoteAPI)
    .set('Authorization',` Bearer ${token}`);
  let user = userResponse.body;
  return user;
}

/**
 * 
 * @param {obj} remoteUser 
 */
async function getUser(remoteUser) {
  let username= remoteUser.localizedFirstName+remoteUser.localizedLastName;
  let userRecord = {
    username: username,
    password: uuidv4(),
    email: `${username}@email.com`,
    role: 'user',
    image: remoteUser.profilePicture.displayImage,
  };
  let tempUserPassword = userRecord.password;
  userRecord.password  = await bcrypt.hash(userRecord.password, 5);
  let userRead = await user.read(username);
  if(!userRead[0]){
    let userSave = await user.create(userRecord); 
    let token = users.generateTokenUp(userSave);
    return [username, token, tempUserPassword];
  }
  return;
}