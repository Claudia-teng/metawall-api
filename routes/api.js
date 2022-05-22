const express = require('express');
const api = express.Router();
const postsRouter = require('./posts')
const usersRouter = require('./users')
const uploadRouter = require('./upload')

api.use('/posts', postsRouter);
api.use('/users', usersRouter);
api.use('/upload', uploadRouter);

api.use((req, res, next) => {
  res.status(404).json({
    "status": "false",
    "message": "Route not found"
  });
});

api.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    "status": "false",
    "message": err.message
  });
})

process.on('uncaughtException', err => {
	console.error('Uncaught Exception!');
	console.error(err);
	process.exit(1);
});

process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Rejection:', promise, 'Reason:', err);
});

module.exports = api;
