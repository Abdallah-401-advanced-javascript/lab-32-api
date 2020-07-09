'use strict';
require('dotenv').config();
const bcrypt =  require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET; // place this in your .env
const mongoDB = require('./models/users/users-model');
const adminMongoDB = require('./models/admin/admin-model');
const timeMongoDB = require('./models/time/time-model');

let users = {}; //exporting
let roles = {
  user:    ['read'],
  writers: ['read', 'create'],
  accountant: ['read', 'account'],
  admin :  ['read', 'manage','update', 'account','create', 'delete'],
};

/**
 * @param {obj}
 */
users.save = async function(record){
  let reading = await mongoDB.read(record.username);
  let emailCheck =  await mongoDB.read(record.email);
  if (!(reading[0] || emailCheck[0])) {
    record.password  = await bcrypt.hash(record.password, 5);
    await mongoDB.create(record);
    return record;
  }
  return Promise.reject();
};

users.saveDirect = async function(record){
  let reading = await adminMongoDB.read(record.username);
  let emailCheck =  await adminMongoDB.read(record.email);
  if (!(reading[0] || emailCheck[0])) {
    record.password  = await bcrypt.hash(record.password, 5);
    await adminMongoDB.create(record);
    return record;
  }
  return Promise.reject();
};

/**
 * @param {obj} record 
 */
users.saveAdmin = async function(record){
  let reading = await adminMongoDB.read(record.username);
  if (!reading[0]) {
    record.workHours=0;
    await adminMongoDB.create(record);
    return record;
  }
  return Promise.reject();
};

/**
 * @description:This function is used to save the time that the employee start his work at the morning
 * @param {obj} record 
 * @param {*} day 
 */
users.saveStartTime = async function(record,day){
  let reading = await timeMongoDB.read(record.username);
  if (!reading[0]) {
    await timeMongoDB.create(record);
    return record;
  }

  if (!(day==reading[reading.length-1].date.split('/')[0])) {
    await timeMongoDB.create(record);
    return record;
  }
  return Promise.reject();
};

/**
 * @description:This function is used to save the time that the employee end his work at the morning
 * @param {obj} record 
 * @param {*} day 
 */
users.saveEndTime = async function(username){
  let reading = await timeMongoDB.read(username);
  if((reading[reading.length-1].workHours==0)){
    var dateEndTime = new Date();
    let hour  = (dateEndTime.getHours()+3);
    let min  = dateEndTime.getMinutes();
    reading[reading.length-1].finishTime=hour+':'+min;
    let time1 = reading[reading.length-1].finishTime;
    let time2 = reading[reading.length-1].startTime;
    let splitTime1= time1.split(':');
    let splitTime2= time2.split(':');
    let hourcalc = parseInt(splitTime1[0])-parseInt(splitTime2[0]);
    let minute = parseInt(splitTime1[1])-parseInt(splitTime2[1]);
    hourcalc = hourcalc + minute/60;
    reading[reading.length-1].workHours=hourcalc.toFixed(2);
    let userFromAdmin = await adminMongoDB.read(username);
    userFromAdmin[0].workHours=(userFromAdmin[0].workHours+hourcalc).toFixed(2);
    await adminMongoDB.PATCH(userFromAdmin[0]._id,userFromAdmin[0]);  
    let test = await timeMongoDB.PATCH(reading[reading.length-1]._id,reading[reading.length-1]);
    return test;
  }
  return Promise.reject();
};

/**
 * @param(string)
 */
// compare the password with the encrypted one
users.authenticateBasic = async function(username, password) {
  let reading = await adminMongoDB.read(username);
  let valid = await bcrypt.compare(password, reading[0].password);  
  return valid ? username : Promise.reject();
};

/**
 * @param {obj} user 
 */
users.generateTokenUp =  function (user) {
  // ,{expiresIn:900}
  let token = jwt.sign({username: user.username , capabilities: roles[user.role]},SECRET,{expiresIn:9999999});
  return token;
};

/**
  * 
 * @param {obj} user 
 */
users.generateTokenIn =  async function (user) {
  let reading =  await adminMongoDB.read(user);  
  // ,{expiresIn:900}
  let token = await jwt.sign({id: reading[0]._id },SECRET,{expiresIn:999999999});
  return token;
};

/**
 * 
 * @param {obj} record 
 */
users.getUserProfile = async function(record){
  let reading = await adminMongoDB.readId(record);
  return reading[0];
};

/**
 * 
 * @param {obj} record 
 */
users.list = async function(record){
  let reading = await mongoDB.read(record);
  return reading;
};

/**
 * 
 * @param {string} id 
 * @param {obj} record 
 */
users.updateUserProfile = async function(id,record){
  let reading = await adminMongoDB.PATCH(id,record);
  return reading[0];
};

/**
 * 
 * @param {string} token 
 */
users.verifyToken = function (token) {
  return  jwt.verify(token, SECRET,async function(err, decoded){
    if (err) {
      return Promise.reject(err);
    }
    console.log('decoded >>>> ',decoded); // {username: usernameValue, ...}
    console.log('decoded >>>> ',decoded.id); // {username: usernameValue, ...}
    let id = decoded.id; // decoded.id
    let reading = await adminMongoDB.readId(id);
    if (reading[0]) {
      return Promise.resolve(decoded);
    } 
    return Promise.reject();
  });
};
/**
 * 
 * @param {string} userId 
 * @param {string} accountatname 
 * @param {number} livingAllowanceAndRewards 
 */
users.accountentData = async function(userId,accountatname,livingAllowanceAndRewards){
  let startDate=livingAllowanceAndRewards.startDate;
  let endDate=livingAllowanceAndRewards.endDate;
  let reading = await adminMongoDB.readId(userId);

  let hourSalary = {
    admin:    22,
    marketing: 12,
    accountant: 16,
    salesperson :  15,
    hr:8,
    developer:19,
    qa:15,
  };
  let usernameT = await timeMongoDB.read(reading[0].username);
  var count = 0;
  startDate = startDate.split('/');
  endDate = endDate.split('/');
  for(let i = 0 ; i < usernameT.length ; i++){
    let date = usernameT[i].date.split('/');
    if((Number(date[0]) >=  Number(startDate[0]) && Number(date[1]) >=  Number(startDate[1]) && Number(date[2]) >=  Number(startDate[2])) && (Number(date[0]) <=  Number(endDate[0]) && Number(date[1]) <=  Number(endDate[1]) && Number(date[2]) <=  Number(endDate[2]))){
      count = count + usernameT[i].workHours;
    }
  }
  let livingAllowance = livingAllowanceAndRewards.livingAllowance;
  let rewards = livingAllowanceAndRewards.rewards;
  let basicSalary = (count)*(hourSalary[reading[0].position]);
  let socialSecurity =  basicSalary*7.5/100;
  let netSalary = basicSalary+livingAllowance+rewards-socialSecurity;
  let financialPaper={
    'Acountant Name:':accountatname,
    'User Name:':reading[0].username,
    'position':reading[0].position,
    'Working hours':count.toFixed(2),
    'hourSalary':hourSalary[reading[0].position]+' JD',
    'Basic salary':basicSalary.toFixed(2)+' JD',
    'Living allowance':livingAllowance.toFixed(2)+' JD',
    'Rewards':rewards.toFixed(2)+' JD',
    'Social security':socialSecurity.toFixed(2)+' JD',
    'Net salary':netSalary.toFixed(2)+' JD',
  };
  return financialPaper;
};

module.exports = users;


