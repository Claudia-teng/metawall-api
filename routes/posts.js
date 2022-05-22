const express = require('express');
const postsRouter = express.Router();
const { isAuth } = require('../services/auth');
const {
  getPosts, 
  createPost,
  deleteAllPosts,
  deletePost,
  editPost,
  likePost,
  unlikePost
} = require('../controllers/posts');

postsRouter.get('/', isAuth, getPosts)
postsRouter.post('/',isAuth, createPost)
postsRouter.delete('/',isAuth, deleteAllPosts)
postsRouter.delete('/:id',isAuth, deletePost)
postsRouter.patch('/:id',isAuth, editPost)
postsRouter.post('/likes/:id',isAuth, likePost)
postsRouter.delete('/likes/:id',isAuth, unlikePost)

module.exports = postsRouter;
