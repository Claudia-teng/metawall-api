const express = require('express');
const uploadRouter = express.Router();
const upload = require('../services/image');

const { isAuth } = require('../services/auth');
const { uploadImage } = require('../controllers/upload');

uploadRouter.post('/', isAuth, upload, uploadImage)

module.exports = uploadRouter;