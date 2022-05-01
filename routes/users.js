const express = require('express');
const usersRouter = express.Router();

usersRouter.get('/', async (req, res) => {
  res.status(200).json({
    "status": "success",
    "data": "success"
  });
})

module.exports = usersRouter;
