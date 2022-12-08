const router = require("express").Router();
const Jwt = require("jsonwebtoken");
const pool = require("../db");
const bcrypt = require("bcrypt");
require("dotenv").config();
//   const { email } = req.body;

//   pool.query(
//     "SELECT * FROM users WHERE email = $1 ",
//     [email],
//     (err, results) => {
//       if (err) {
//         res.send({ err: err });
//       }

//       if (results.rows.length !== 0) {
//         res.send({ data: results.rows[0], msg: "sent ok" });
//       } else {
//         res.send("Email doesn't exist!!");
//       }
//       //   res.send("ok");

//       const secret = process.env.JWTSECRET + results.password;
//       const payload = {
//         email: results.rows[0].email,
//         id: results.rows[0].id,
//       };

//       const token = Jwt.sign(payload, secret, { expiresIn: "15m" });

//       const link = `http://localhost:3000/restPassword/${results.rows[0].id}/${token}`;
//       console.log(link);
//       //   res.send("ok sent");
//     }
//   );
// });
const nodemailer = require("nodemailer");

const saltRounds = 10;

//reset password post
router.post("/", async (req, res) => {
  const { email } = req.body;

  pool.query(
    "SELECT * FROM users WHERE email = $1 ",
    [email],

    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.rows.length > 0) {
        res.send("Password reset link has been sent to email...");

        const secret = process.env.JWTSECRET + result.password;
        const payload = {
          email: result.rows[0].email,
          id: result.rows[0].id,
        };

        const token = Jwt.sign(payload, secret, { expiresIn: "15m" });

        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: " iken6970@gmail.com",
            pass: "cisoiclhegsygqnz",
          },
        });

        var mailOptions = {
          from: "iken6970@gmail.com",
          to: "kingchiji89@gmail.com",
          subject: "Password Reset",

          html: `We heard that you just lost the password <p> Don't worry, use the link below to reset it</p>
            This link valid for 15 minutes  http://localhost:3000/forget_password/${result.rows[0].id}/${token}
          `,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("email send " + info.response);
          }
        });
      } else {
        res.status(400).send({ data: "Email doesn't exist!! " });
      }
    }
  );
});

//verify user for forgot password time
router.get("/rest-password/:id/:token", (req, res) => {
  const { id, token } = req.params;

  pool.query("SELECT * FROM users WHERE id= $1 ", [id], (err, result) => {
    if (err) {
      throw err;
    } else {
      const secret = process.env.JWTSECRET + result.password;
      const payload = Jwt.verify(token, secret, (err, done) => {
        if (err) {
          res.status(400).send({ data: "Token has been expired...!" });
        } else {
          res.status(201).send({ data: "You can now enter a new Password..." });
        }
      });
    }
  });
});

/* update password to database */
router.post("/rest-password/:id/:token", (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  pool.query(
    "SELECT * FROM users email WHERE id= $1",
    [id],
    (error, result) => {
      const secret = process.env.JWTSECRET + result.password;
      const payload = Jwt.verify(token, secret, (err, done) => {
        if (err) {
          res.status(400).send({ data: "Token has been expired...!" });
        } else {
          if (done) {
            bcrypt.hash(password, saltRounds, (err, hash) => {
              if (err) {
                res.status(400).send("Token has been expired...!");
                return;
              } else if (hash) {
                pool.query(
                  "UPDATE users SET password=$1 WHERE id=$2",
                  [hash, id],
                  (err, resp) => {
                    if (err) {
                      res.status(400).send({ data: "not ok...!" });
                    } else {
                      res
                        .status(201)
                        .json(
                          "Your password  have been reset successfully...!"
                        );
                    }
                  }
                );
              }
            });
          }

          // if (done) {
          //   const passwordHash = bcrypt.hash(password, 10);
          //   console.log(passwordHash);
          // }
        }
      });
    }
  );
  // console.log(req.body);
  // pool.query(
  //   "SELECT * FROM users email WHERE id= $1",
  //   [id],
  //   (error, result) => {
  //     // console.log(result.rows[0]);
  //     const secret = process.env.JWTSECRET + result.password;
  //     const payload = Jwt.verify(token, secret, (err, done) => {
  //       if (err) {
  //         res.status(400).json("Token has been expired please try angina...!");
  //       } else {
  //         if (done) {
  //           bcrypt.compare(password, result.rows[0].password, (err, match) => {
  //             console.log(match);
  //             if (match) {
  //               bcrypt.hash(result.rows[0], saltRounds, function (er, hash) {
  //                 console.log(hash);
  //                 if (er) return res.status(400).json("invalid"); // and this one!!

  //                 pool.query(
  //                   "UPDATE users SET password=($1) WHERE id=($2)",
  //                   [hash, id],
  //                   (err, results) => {
  //                     res.status(200).json("ok");
  //                     // results.rows = password;1
  //                     console.log(results.rows);
  //                   }
  //                 );
  //               });
  //             } else {
  //               res.status(400).json("You can not ");
  //             }
  //           });
  //         } else {
  //           res.status(400).json("You can not update!!!");
  //         }
  //       }
  //     });
  //   }
  // );
});
// router.post("/rest-password/:id/:token", (req, res) => {
//   const { id, token } = req.params;
//   const { password } = req.body;

//   pool.query(
//     "SELECT * FROM users email WHERE id= $1",
//     [id],
//     (error, result) => {
//       // console.log(result.rows[0]);
//       const secret = process.env.JWTSECRET + result.password;
//       if (error) return res.status(400).json("ind id"); // pass to caller
//       bcrypt.compare(result.rows, result.rows[0].password, (err, match) => {
//         const payload = Jwt.verify(token, secret);
//         if (err) return res.status(400).json("ind"); // pass this one too!
//         if (match) {
//           bcrypt.hash(result.rows, saltRounds, function (er, hash) {
//             if (er) return res.status(400).json("no"); // and this one!!
//             pool.query(
//               "UPDATE users SET password=? WHERE id=?",
//               [hash, id],
//               (err, results) => {
//                 if (err) {
//                   res.status(400).json("is not ok");
//                 } else {
//                   if (results.rows) {
//                     res.status(201).json("ok");
//                   }
//                 }
//               }
//               // callback
//             );
//           });
//         } else {
//           res.status(400).json("not");
//           // that's not good, send an error to the caller
//           // var err = new Error("Password does not match");
//           // err.code = "BAD_PASSWORD";
//           // callback(err);
//         }
//       });
//     }
//   );
// });

// Complete source code of users.js rout

module.exports = router;
