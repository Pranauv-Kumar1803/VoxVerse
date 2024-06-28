const express = require('express');
const multer = require("multer");
const router = express.Router();
const { uploadFile, getAllFiles, getFile } = require('../controllers/fileController');


const DIR = "./public/files";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname
      .toLowerCase()
    cb(null, String(new Date().getTime()) + "-" + fileName);
  },
});

var upload = multer({
  limits: { fieldSize: 2 * 1024 * 1024 },
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "audio/mpeg" || file.mimetype == "audio/mp3" || file.mimetype == "audio/aac" || file.mimetype == "audio/ogg" || file.mimetype == "audio/mp4" || file.mimetype == "audio/wav"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only audio files format allowed!"));
    }
  },
});

router.get('/all', getAllFiles);

router.get('/:file', getFile);

router.post('/', upload.single("file"), uploadFile);

module.exports = router;