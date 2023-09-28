const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/public/uploads`);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploader = multer({
  storage,
  onError: (err, next) => {
    next();
  },
});

module.exports = { uploader };
