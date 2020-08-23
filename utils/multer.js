const multer = require('multer');
const path = require('path');
var fs = require('fs');
var AWS = require('aws-sdk');
var multerS3 = require('multer-s3');

// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_SECRET_ID,
//   secretAccessKey: process.env.AWS_SECRET_KEY,
// });

// console.log(s3);

var storageBG = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = `./public/uploads/${req.user.username}/background`;
    // var dir2 = `./public/uploads/${username}/images`;
    // var dir3 = `./public/uploads/${username}/thumbnails`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    // if (!fs.existsSync(dir2)) fs.mkdirSync(dir2);
    // if (!fs.existsSync(dir3)) fs.mkdirSync(dir3);
    cb(null, `./public/uploads/${req.user.username}/background`);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + req.user.username + Date.now() + file.originalname,
    );
  },
});

var storagePle = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = `./public/uploads/${req.user.username}/people/`;
    // var dir2 = `./public/uploads/${username}/images`;
    // var dir3 = `./public/uploads/${username}/thumbnails`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    // if (!fs.existsSync(dir2)) fs.mkdirSync(dir2);
    // if (!fs.existsSync(dir3)) fs.mkdirSync(dir3);
    cb(null, `./public/uploads/${req.user.username}/people/`);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + req.user.username + Date.now() + file.originalname,
    );
  },
});

// const storageS3 = multerS3({
//   s3: s3,
//   bucket: 'imgbg',
//   metadata: function (req, file, cb) {
//     cb(null, { fieldName: file.fieldname });
//   },
//   key: function (req, file, cb) {
//     cb(null, Date.now().toString());
//   },
// });

const uploadBG = multer({
  storage: storageBG,
  limits: { fieldSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('imgBG');

const uploadPle = multer({
  storage: storagePle,
  limits: { fieldSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array('imgPle');

// const uploadPle2 = multer({
//   storage: storagePle,
//   limits: { fieldSize: 1000000 },
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
// }).array('imgPle2');

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

module.exports = { uploadBG, uploadPle };
