const express = require('express');
const uploadRouter = express.Router();

const { isAuth } = require('../services/auth');
const { uploadImage } = require('../controllers/upload');

uploadRouter.post('/', isAuth, uploadImage)

module.exports = uploadRouter;