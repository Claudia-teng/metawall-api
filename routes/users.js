const express = require('express');
const usersRouter = express.Router();
const { isAuth } = require('../services/auth');
const { 
  signup, 
  login,
  updatePassword,
  getProfile,
  updateProfile
} 
= require('../controllers/users');

usersRouter.post('/signup', signup);
usersRouter.post('/login', login);
usersRouter.post('/update-password', isAuth, updatePassword);
usersRouter.get('/profile', isAuth, getProfile);
usersRouter.patch('/profile', isAuth, updateProfile);

module.exports = usersRouter;
