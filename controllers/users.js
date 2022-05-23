const bcrypt = require('bcryptjs')
const validator = require('validator');
const Users = require('../models/users');
const Posts = require('../models/posts');
const { generateJWT } = require('../services/auth');

async function signup (req, res) {
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

  // verify duplicate email
  const existEmail = await Users.findOne({email});
  console.log('existEmail', existEmail)
  if (existEmail) {
    return res.status(400).json({
      error: 'This email has signed up before.'
    });
  }

  // encrypt password
  password = await bcrypt.hash(password, 12);

  try {
    const newUser = await Users.create({
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
}

async function login (req, res) {
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

  const user = await Users.findOne({email}).select('+password');
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
}

async function updatePassword(req, res) {
  let { password, newPassword, confirmPassword } = req.body;

  // verify required fields
  if (!password) {
    return res.status(400).json({
      error: 'Please enter the password.'
    });
  }
  else if (!newPassword) {
    return res.status(400).json({
      error: 'Please enter the new password.'
    });
  } else if (!confirmPassword) {
    return res.status(400).json({
      error: 'Please enter the confirm password.'
    });
  }

  // verify confirm password
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      error: 'New password and confirm password must be match.'
    });
  }

  // verify password length
  if (!validator.isLength(newPassword, { min: 8 })) {
    return res.status(400).json({
      error: 'New password must be at least 8 characters.'
    });
  }

  // verify current password
  try {
    const user = await Users.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(400).json({
        error: 'User not found.'
      });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).json({
        error: 'Your password is incorrect.'
      });
    }
  } catch(err) {
    return res.status(400).json({
      error: 'User not found.'
    });
  }

  // encrypt password
  newPassword = await bcrypt.hash(newPassword, 12);

  try {
    await Users.findByIdAndUpdate(req.user.id, {
      password: newPassword
    }, {
      runValidators: true
    });
    return res.status(200).json({
      ok: true
    });
  } catch(err) {
    return res.status(400).json({
      error: err.message
    });
  }
}

async function getProfile(req, res) {
  res.status(200).json(req.user);
}

async function updateProfile(req, res) {
  const { name, photo } = req.body;

  if (!name) {
    return res.status(400).json({
      error: 'Name is required.'
    });
  }

  try {
    await Users.findByIdAndUpdate(req.user.id, {
      name: name,
      photo: photo || ''
    }, {
      runValidators: true
    });

    return res.status(200).json({
      ok: true
    });
  } catch(err) {
    return res.status(400).json({
      error: err.message
    });
  }
}

async function getUserPost(req, res) {
  const id = req.params.id;
  const user = await existsUserWithId(id);

  if (!user) {
    return res.status(400).json({
      error: 'User not found!'
    });
  }

  const posts = Posts.find({user});
  return res.status(200).json(await posts);
}

async function getLikeList(req, res) {
  const likedPosts = await Posts.find({
    likes: { $in: [req.user.id] }
  }).populate({
    path: 'userId',
    select:"name photo"
  })
  return res.status(200).json(await likedPosts);
}

async function existsUserWithId(id) {
  try {
    return await Users.findById(id);
  } catch (err) {
    return null;
  }
}

module.exports = {
  signup,
  login,
  updatePassword,
  getProfile,
  updateProfile,
  getUserPost,
  getLikeList
}