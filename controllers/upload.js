const { ImgurClient } = require('imgur');

async function uploadImage(req, res) {
  if (!req.files.length) {
    return res.status(400).json({
      error: 'Please upload a file.'
    })
  }

  const client = new ImgurClient({
    clientId: process.env.IMGUR_CLIENT_ID,
    clientSecret: process.env.IMGUR_CLIENT_SECRET,
    refreshToken: process.env.IMGUR_REFRESH_TOKEN
  })

  const response = await client.upload({
    image: req.files[0].buffer.toString('base64'),
    type: 'base64',
    album: process.env.IMGUR_ALBUM_ID
  });

  // todo - error handling
  
  return res.status(200).json({
    imgUrl: response.data.link
  })
}

module.exports = {
  uploadImage
}