const express = require('express');
const usersRouter = express.Router();
const bcrypt = require('bcryptjs')
const validator = require('validator');
const User = require('../models/users');
const { generateJWT } = require('../services/auth');

usersRouter.post('/signup', async (req, res) => {
  let { email, password, confirmPassword, name } = req.body;
  
  // verify required fields
  if (!email) {
    return res.status(400).json({
      error: 'Email is required.'
    });
  } else if (!password) {
    return res.status(400).json({
      error: 'Password is required.'
    });
  } else if (!confirmPassword) {
    return res.status(400).json({
      error: 'Confirm password is required.'
    });
  } else if (!name) {
    return res.status(400).json({
      error: 'Name is required.'
    });
  }

  // verify confirm password
  if (password !== confirmPassword) {
    return res.status(400).json({
      error: 'Password and confirm password must be match.'
    });
  }

  // verify password length
  if (!validator.isLength(password, { min: 8 })) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters.'
    });
  }

  // verify email
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      error: 'Please enter a valid email.'
    });
  }

  // encrypt password
  password = await bcrypt.hash(password, 12);

  try {
    const newUser = await User.create({
      name,
      email, 
      password,
    })
    generateJWT(newUser, 201, res);
  } catch(err) {
    return res.status(400).json({
      error: err.message
    });
  }
})

usersRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // verify required fields
  if (!email) {
    return res.status(400).json({
      error: 'Email is required.'
    });
  } else if (!password) {
    return res.status(400).json({
      error: 'Password is required.'
    });
  }

  // verify email
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      error: 'Please enter a valid email.'
    });
  }

  const user = await User.findOne({email}).select('+password');
  if (!user) {
    return res.status(400).json({
      error: 'This email has not been signed up yet.'
    });
  }

  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    return res.status(400).json({
      error: 'Your email or password is incorrect.'
    });
  }

  generateJWT(user, 200, res);
})

module.exports = usersRouter;
