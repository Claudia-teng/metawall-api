const multer = require('multer');
const path = require('path')
const upload = multer({
  limits: {
    fileSize: 2*1024*1024
  },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
      // todo - error handling
      // file size & wrong file type
      cb(new Error('Wrong file type. Please upload only JPG, PNG or JPEG.'))
    }
    cb(null, true)
  }
}).any();

module.exports = upload;