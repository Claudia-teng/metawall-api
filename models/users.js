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