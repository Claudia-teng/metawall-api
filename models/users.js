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
    photo: String,
  });

const User = mongoose.model('user', userSchema);

module.exports = User;