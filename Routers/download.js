const router = require("express").Router();
const pool = require("../db");
const https = require("https");
const path = require("path");
const fs = require("fs");
var mime = require("mime");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jfif" ||
    file.mimetype === "image/PNG" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: fileFilter,
});

router.get("/", function (req, res, next) {
  res.download(
    "./uploads/2022-12-01T08-37-59.001Z-Chijioke's Laptop Spec.pdf",
    function (err) {
      if (err) {
        next(err);
      }
    }
  );
});

// router.get("/", (req, res, next) => {
//   filePath = path.join(__dirname, "../uploads") + "/" + req.body.filename;
//   console.log(filePath);
//   // res.sendFile(filePath);
// });

module.exports = router;
