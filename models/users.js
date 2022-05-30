const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please enter your name.']
    },
    email: {
      type: String,
      required: [true, 'Please enter your email.'],
      unique: [true, 'This email has signed up before.'],
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
      ref: 'user',
    },
    following: {
      type: [ mongoose.Schema.ObjectId ],
      ref: 'user',
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

const User = mongoose.model('user', userSchema);

module.exports = User;