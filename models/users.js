const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please enter your name.']
    },
    email: {
      type: String,
      required: [true, 'Please enter your email.'],
      unique: true,
      lowercase: true,
      select: false
    },
    photo: {
      type: String
    },
    password: {
      type: String,
      required: [true, 'Please enter your passwords'],
      minlength: 8,
      select: false
    },
    followers: {
      type: [ mongoose.Schema.ObjectId ],
      ref: 'User',
    },
    following: {
      type: [ mongoose.Schema.ObjectId ],
      ref: 'User',
    },
    googleId: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    }
  },{
    versionKey: false
  });

const Users = mongoose.model('User', userSchema);

module.exports = Users;