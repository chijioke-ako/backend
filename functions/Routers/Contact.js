const router = require("express").Router();
const { request } = require("express");
const pool = require("../db");

//post contact

router.post("/", async (req, res) => {
  const { fullname, email, telephone, message } = req.body;

  pool.query(
    "INSERT INTO contact (fullname, email, telephone, message ) VALUES ($1, $2, $3, $4) RETURNING *",
    [fullname, email, telephone, message],

    (err, results) => {
      if (!fullname || !telephone || !email) {
        return res.status(400).json({ msg: "Please fill all fields" });
      } else {
        res.status(201).json({
          status: "contact Submit Successfully !",
          data: {
            contact: results.rows[0],
          },
        });
      }
    }
  );
});

router.post("/", async (req, res) => {
  if (
    req.body.captcha == undefined ||
    req.body.captcha == "" ||
    req.body.captcha == null
  ) {
    return res.json({ success: false, msg: "Please select captcha" });
  }

  const VerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secrect=${process.env.RECAPTCHA_SECRETKEY}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

  request(VerifyUrl, (err, response, body) => {
    body = JSON.parse(body);

    if (body.success !== undefined && !body.success) {
      return res.json({ success: false, msg: "failed captcha verification" });
    }
  });
});

module.exports = router;
