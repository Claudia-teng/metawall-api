const jwt = require('jsonwebtoken');
const User = require('../models/users');

async function isAuth(req, res, next) {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // no token
  if (!token) {
    return res.status(401).json({
      error: 'User not login.'
    })
  }

  // verify token
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    })
  })

  // get user
  const currentUser = await User.findById(decoded.id);
  req.user = currentUser;
  next();
}

function generateJWT(user, statusCode, res) {
  const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY
  })
  res.status(statusCode).json({
    user: {
      token,
      name: user.name,
      photo: user.photo
    }
  })
}

module.exports = {
  isAuth,
  generateJWT
}
