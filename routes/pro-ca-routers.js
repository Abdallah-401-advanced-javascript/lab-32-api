'use strict';

const express = require('express');
const router = express.Router();
const todo = require(`../models/todo/todo-model`);
const product = require(`../models/product/product-model`);
const cart = require(`../models/cart/cart-model`);
const basicAuth = require('./middleware/basic-auth-middleware');
const oath = require('./middleware/oauth-middleware');
const users = require('./users');



// Define the parameter for run the getModel middleware ============>

/** LAB - todo list */
router.get('/todo', readTodo);
router.post('/todo', createTodo);
router.delete('/todo', deleteTodo);
router.put('/todo', updateTodo);

/** Signup-Signin Routes */
/** LAB - react Auth */
router.post('/signup',signup);
router.post('/signin',basicAuth,signin);
router.get('/users',list);
router.get('/oauth', oath, (req, res)=> {
  res.status(200).send(req.token);
});

/** LAB - Redux - Asynchronous Actions */
router.get('/product', readProduct);
router.post('/product', createProduct);
router.delete('/product', deleteProduct);
router.patch('/product', updateProduct);

router.get('/cart', readCart);
router.post('/cart', createCart);
router.delete('/cart', deleteCart);
router.patch('/cart', updateCart);

function signin(req, res, next) {
  res.cookie(req.token);
  res.status(200).send({ 'user': {
    'username': 'hello',
    'fullname': 'rawan',
    'email': 'r@r.com',
    'acl': {
      'capabilities': [
        'read',
        'update',
        'delete',
      ],
      '_id': '5f049d7e7c213e16a464bb74',
      'role': 'admin',
    },
  },token:req.token}); // return token 4
}

function signup(req, res, next) {
  //sign up route if we have the user, return failure, else return generated token.
  let user = req.body;
  console.log(user);
  users.save(user).then(result => {
    // generate a token and return it.
    let token = users.generateTokenUp(result);
    console.log('generated token',token);
    // req.token=token;
    res.cookie(token);
    res.status(200).send({token:token});
  }).catch(err=> {
    console.log('ERR!!');
    res.status(403).send('Invalid Signup! email is taken');
  });
}

function list(req, res, next) {
  users.list(undefined).then(result => {
    console.log('prove of life');
    console.log(result);
    res.status(200).send(result);
  }).catch(err=> {
    console.log('ERR!!');
    res.status(403).send('Listing error');
  });
}

/**
 * 
 * @param {opject} req 
 * @param {opject} res 
 * @param {function} next 
 */
async function readTodo(req, res) {
  // CRUD operation
  await todo.read()
    .then(data => {
      res.status(200).json(data);

    })
    .catch('Error');
}

/**
 * 
 * @param {opject} req 
 * @param {opject} res 
 * @param {function} next 
 */
function createTodo(req,res ) {
  // CRUD operation
  todo.create(req.body)
    .then(data => {
      res.status(201).json(data); // {_id: monogid, }
    }).catch('Error');
}

/**
 * 
 * @param {opject} req 
 * @param {opject} res 
 * @param {function} next 
 */
function deleteTodo(req,res) {
  // CRUD operation
  todo.delete(req.body._id)
    .then(data => {
      res.status(200).json(data);
    }).catch('Error');
}

/**
 * 
 * @param {opject} req 
 * @param {opject} res 
 * @param {function} next 
 */
function updateTodo(req,res) {
  // CRUD operation
  console.log('----->>>> testing update route ',req.params._id,req.body);
  todo.update(req.body._id,req.body)
    .then(data => {
      res.status(200).json(data);
    }).catch('Error');
}

async function readProduct(req, res) {
  // CRUD operation
  await product.read()
    .then(data => {
      res.status(200).json(data);

    })
    .catch('Error');
}

/**
 * 
 * @param {opject} req 
 * @param {opject} res 
 * @param {function} next 
 */
function createProduct(req,res ) {
  // CRUD operation
  product.create(req.body)
    .then(data => {
      res.status(201).json(data); // {_id: monogid, }
    }).catch('Error');
}

/**
 * 
 * @param {opject} req 
 * @param {opject} res 
 * @param {function} next 
 */
function deleteProduct(req,res) {
  // CRUD operation
  product.delete(req.body._id)
    .then(data => {
      res.status(200).json(data);
    }).catch('Error');
}

/**
 * 
 * @param {opject} req 
 * @param {opject} res 
 * @param {function} next 
 */
function updateProduct(req,res) {
  // CRUD operation
  console.log('----->>>> testing update route ',req.params._id,req.body);
  product.update(req.body._id,req.body)
    .then(data => {
      res.status(200).json(data);
    }).catch('Error');
}

/**
 * 
 * @param {opject} req 
 * @param {opject} res 
 * @param {function} next 
 */
async function readCart(req, res) {
  // CRUD operation
  await cart.read()
    .then(data => {
      res.status(200).json(data);

    })
    .catch('Error');
}
/**
 * 
 * @param {opject} req 
 * @param {opject} res 
 * @param {function} next 
 */
function createCart(req,res ) {
  // CRUD operation
  cart.create(req.body)
    .then(data => {
      res.status(201).json(data); // {_id: monogid, }
    }).catch('Error');
}


/**
 * 
 * @param {opject} req 
 * @param {opject} res 
 * @param {function} next 
 */
function deleteCart(req,res) {
  // CRUD operation
  cart.delete(req.body._id)
    .then(data => {
      res.status(200).json(data);
    }).catch('Error');
}


function updateCart(req,res) {
  // CRUD operation
  console.log('----->>>> testing update route ',req.params._id,req.body);
  cart.update(req.body._id,req.body)
    .then(data => {
      res.status(200).json(data);
    }).catch('Error');
}
module.exports = router;