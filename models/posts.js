const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: [true, 'Please specify the user.']
  },
  tags: {
    type: [ String ]
  },
  image: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    required: [true, 'Please enter the content.']
  },
  likes: {
    type: [ mongoose.Schema.ObjectId ],
    ref: 'user',
  },
  comments: {
    type: Number,
    default: 0
  }
},{
  versionKey: false
});

const Post = mongoose.model('Post', postsSchema);

module.exports = Post;