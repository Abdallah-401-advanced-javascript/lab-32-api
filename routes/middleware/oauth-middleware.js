'use strict';

require('dotenv').config();
const users = require('../users');
const superagent = require('superagent');
// add them in ur .env
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TOKEN_SERVER_URL = process.env.TOKEN_SERVER_URL;
const REMOTE_USER_API = process.env.REMOTE_USER_API;
const API_SERVER = 'http://localhost:3030/oauth'; 

module.exports = async (req, res, next)=> {
  // we will do all steps
  // 1- login superagent, get the token
  // 2- i have the token, take the token and give me back the user
  // 3- add it to my DB.
  // 4 - the form
  // try it 
  try {
    let code = req.query.code;
    console.log('1- CODE: ', code);

    let remoteToken = await exchangeCodeForToken(code);

    let remoteUser = await getRemoteUserInfo(remoteToken);

    let [user , token] = await getUser(remoteUser);
    req.user = user; 
    req.token = token;
    console.log('local user ... ', token);
    console.log('local user ... ', user);

    next();

  } catch (e) {
    console.log(`ERROR: ${e}`);
    next('error');
  }

};


async function exchangeCodeForToken(code) {
  let tokenResponse = await superagent.post(TOKEN_SERVER_URL).send({
    client_id : CLIENT_ID,
    client_secret : CLIENT_SECRET, 
    redirect_uri: API_SERVER,
    code: code,
    // grant_type check it 
  });
    // access_token=e72e16c7e42f292c6912e7710c838347ae178b4a&token_type=bearer
  let access_token = tokenResponse.body.access_token;
  console.log('______STEP 2 ____access_token ------>>>> ', access_token);
  return access_token;
}

// curl -H "Authorization: token OAUTH-TOKEN" https://api.github.com/user
async function getRemoteUserInfo(token) {
  let userResponse = await superagent
    .get(REMOTE_USER_API)
    .set('Authorization', `token ${token}`)
    .set('user-agent', 'express-app');

  let user = userResponse.body; // will return user obj + repos
  console.log('_____STEP 3____ ', user);
  return user;
}

async function getUser(remoteUser) {
  let userRecord = {
    username: remoteUser.login, // this will be my email
    password: 'oauthpassword',
  };
  var savedUser;
  console.log('proveoflsadlsa;jf;lvdsa;lvadsl;v');
  try{
    savedUser = await users.save(userRecord);
  }catch (e) {
    console.log(`ERROR: ${e}`);}
  let myServerToken = users.generateToken(userRecord);
  console.log('myServerToken', myServerToken);
  console.log('local user ... ', savedUser); 
  return [savedUser, myServerToken]; // {user: user, token: token}
}





// 