const express = require('express');
const postsRouter = express.Router();
const {
  getPosts, 
  createPost,
  deleteAllPosts,
  deletePost,
  editPost,
} = require('../controllers/posts');

postsRouter.get('/', getPosts)
postsRouter.post('/', createPost)
postsRouter.delete('/', deleteAllPosts)
postsRouter.delete('/:id', deletePost)
postsRouter.patch('/:id', editPost)

module.exports = postsRouter;
