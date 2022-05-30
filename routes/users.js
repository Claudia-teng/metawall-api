require('dotenv').config();
const express = require('express');
const usersRouter = express.Router();
const passport = require('passport');
const { isAuth } = require('../services/auth');
const { 
  signup, 
  login,
  googleCallBack,
  updatePassword,
  getProfile,
  updateProfile,
  getLikeList,
  followUser,
  unfollowUser,
  getFollowingList
} 
= require('../controllers/users');

// auth
usersRouter.post('/signup', signup);
usersRouter.post('/login', login);
usersRouter.get('/google', passport.authenticate('google', { scope: [ 'profile' ]}));
usersRouter.get('/google/callback', 
  passport.authenticate('google', { session: false }), 
  googleCallBack
);

usersRouter.post('/update-password', isAuth, updatePassword);
usersRouter.get('/profile', isAuth, getProfile);
usersRouter.patch('/profile', isAuth, updateProfile);
usersRouter.get('/like-list', isAuth, getLikeList);
usersRouter.post('/follow/:id', isAuth, followUser);
usersRouter.delete('/unfollow/:id', isAuth, unfollowUser);
usersRouter.get('/following', isAuth, getFollowingList);

module.exports = usersRouter;
