const express = require('express');
const api = express.Router();
const postsRouter = require('./posts')
const usersRouter = require('./users')

api.use('/posts', postsRouter);
api.use('/users', usersRouter);

module.exports = api;
