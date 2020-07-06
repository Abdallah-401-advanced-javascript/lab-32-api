'use strict';

const express = require('express');
const router = express.Router();
const todo = require(`../models/todo/todo-model`);



// Define the parameter for run the getModel middleware ============>

router.get('/todo', readTodo);
router.post('/todo', createTodo);
router.delete('/todo', deleteTodo);
router.put('/todo', updateTodo);

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

module.exports = router;