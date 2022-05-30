require('dotenv').config();
const express = require('express');
const usersRouter = express.Router();
const { isAuth, generateJWT} = require('../services/auth');
const Users = require('../models/users');
const passport = require('passport');
const bcrypt = require('bcryptjs');
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
const res = require('express/lib/response');

// auth
usersRouter.post('/signup', signup);
usersRouter.post('/login', login);
usersRouter.get('/google', passport.authenticate('google', {
  scope: [ 'email', 'profile' ],
}));
usersRouter.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: 'google/failure',
    session: false 
  }),
  async (req, res) => {
    const profile = req.user;
    // console.log(profile)
    // todo - handle google auth error

    // if user login with Google before
    let user = await Users.findOne({ googleId: profile.id });
    if (user) {
      return generateJWT(user, 200, res);
    }

    // if user hasn't login with Google but signed up before
    user = await Users.findOneAndUpdate(
      { email: profile.emails[0].value },
      { googleId: profile.id }
    );

    if(user) {
      return generateJWT(user, 200, res);
    }

    // if user hasn't logged with Google & signed up before
    try {
      const password = await bcrypt.hash(profile.id, 12);
      const newUser = await Users.create({
        email: profile.emails[0].value,
        name: profile.displayName,
        photo: profile.photos[0].value,
        password,
        googleId: profile.id
      })
      return generateJWT(newUser, 201, res);
    } catch(err) {
      return res.status(400).json({
        error: err.message
      })
    }
  }
);
usersRouter.get('google/failure', (req, res) => {
  res.status(400).json({
    error: "Google login failed"
  })
})


usersRouter.post('/update-password', isAuth, updatePassword);
usersRouter.get('/profile', isAuth, getProfile);
usersRouter.patch('/profile', isAuth, updateProfile);
usersRouter.get('/like-list', isAuth, getLikeList);
usersRouter.post('/follow/:id', isAuth, followUser);
usersRouter.delete('/unfollow/:id', isAuth, unfollowUser);
usersRouter.get('/following', isAuth, getFollowingList);

module.exports = usersRouter;
