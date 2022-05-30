const express = require('express');
const usersRouter = express.Router();
const { isAuth } = require('../services/auth');
const { 
  signup, 
  login,
  updatePassword,
  getProfile,
  updateProfile,
  getLikeList,
  followUser,
  unfollowUser,
  getFollowingList
} 
= require('../controllers/users');

usersRouter.post('/signup', signup);
usersRouter.post('/login', login);
usersRouter.post('/update-password', isAuth, updatePassword);
usersRouter.get('/profile', isAuth, getProfile);
usersRouter.patch('/profile', isAuth, updateProfile);
usersRouter.get('/like-list', isAuth, getLikeList);
usersRouter.post('/follow/:id', isAuth, followUser);
usersRouter.delete('/unfollow/:id', isAuth, unfollowUser);
usersRouter.get('/following', isAuth, getFollowingList);

module.exports = usersRouter;
