const upload = require('../services/image');
const { ImgurClient } = require('imgur');

async function uploadImage(req, res) {
  upload(req, res, async function (err) {
    // verify file
    const files = req.files;
    if (!files.length) {
      return res.status(400).json({
        error: 'Please upload a file.'
      })
    }

    // multer error
    if (err) {
      return res.status(400).json({ 
        error: err.message 
      })
    }

    // Imgur
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENT_ID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN
    })
  
    const response = await client.upload({
      image: files[0].buffer.toString('base64'),
      type: 'base64',
      album: process.env.IMGUR_ALBUM_ID
    });
  
    // Imgur error
    if (response.status !== 200) {
      return res.status(400).json({
        error: response.data,
      })
    } else {
      return res.status(200).json({
        imgUrl: response.data.link
      })
    }
  })
}

module.exports = {
  uploadImage
}