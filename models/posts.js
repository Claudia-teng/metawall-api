const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please specify the user.']
  },
  tags: {
    type: [ String ]
  },
  image: {
    type: String,
    default: ''
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
    ref: 'User',
  }
},{
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

postsSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'postId',
  localField: '_id'
});

const Posts = mongoose.model('Post', postsSchema);

module.exports = Posts;