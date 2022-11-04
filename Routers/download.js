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
    "./uploads/2022-09-25T13-16-33.757Z-Chijioke's Laptop Spec.pdf",
    function (err) {
      if (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
