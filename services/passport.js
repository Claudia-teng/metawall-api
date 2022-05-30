const Users = require('../models/users');
const passport = require('passport');
const bcrypt = require('bcryptjs')
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/users/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }
));