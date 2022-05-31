const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, 'Please enter the comment.']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      require: ['true', 'User must belong to a comment']
    },
    postId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      require: ['true', 'Comment must belong to a post.']
    }
  }
);
commentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'id name photo'
  });

  next();
});
const Comments = mongoose.model('Comment', commentSchema);

module.exports = Comments;