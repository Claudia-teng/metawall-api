const express = require('express');
const postsRouter = express.Router();
const { isAuth } = require('../services/auth');
const {
  getPosts, 
  createPost,
  deleteAllPosts,
  deletePost,
  getUserPost,
  editPost,
  likePost,
  unlikePost,
  commentPost,
  getSinglePost
} = require('../controllers/posts');

postsRouter.get('/', isAuth, getPosts)
postsRouter.get('/:id', isAuth, getSinglePost)
postsRouter.post('/',isAuth, createPost)
postsRouter.delete('/',isAuth, deleteAllPosts)
postsRouter.delete('/:id',isAuth, deletePost)
postsRouter.patch('/:id',isAuth, editPost)
postsRouter.get('/user/:id', isAuth, getUserPost);
postsRouter.post('/likes/:id',isAuth, likePost)
postsRouter.delete('/likes/:id',isAuth, unlikePost)
postsRouter.post('/comments/:id',isAuth, commentPost)

module.exports = postsRouter;
