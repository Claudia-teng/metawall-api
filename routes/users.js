const express = require('express');
const usersRouter = express.Router();
const { signup, login } = require('../controllers/users');

usersRouter.post('/signup', signup);
usersRouter.post('/login', login);

module.exports = usersRouter;
