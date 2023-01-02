const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
require('dotenv').config();

const authenticate = require('../middleware/authorizition');

const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
  try {
    const allUsers = await pool.query('SELECT * FROM users ');
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

router.post('/register', authenticate, (req, res) => {
  const { firstname, lastname, email, role, password } = req.body;

  if (!firstname || !lastname || !email || !password)
    return res.json({
      error: 'Please enter your email and password ',
    });
  else {
    pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
      async (err, result) => {
        if (err) throw err;
        if (result.rows[0])
          return res.json({
            data: 'Email has already been registered',
          });
        else {
          const passwordHash = await bcrypt.hash(password, 10);
          pool.query(
            'INSERT INTO users (firstname, lastname, email, password, role ) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [firstname, lastname, email, passwordHash, role],

            (err, results) => {
              if (err) throw err;

              return res.json({
                data: 'user has been registered',
              });
            }
          );
        }
      }
    );
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  pool.query(
    'SELECT * FROM users WHERE email = $1 ',
    [email],

    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.rows.length > 0) {
        bcrypt.compare(password, result.rows[0].password, (err, done) => {
          if (done) {
            const id = result.rows[0].id;
            const role = result.rows[0].role;

            const token = jwt.sign({ id, role }, process.env.JWTSECRET, {
              expiresIn: '1h',
            });
            // req.session.user = result.rows[0];

            res.status(201).json({
              status: 'Login Successfully ! ',
              auth: true,
              token: token,

              data: {
                user: result.rows[0],
              },
            });
          } else {
            res
              .status(400)
              .send({ data: 'wrong email or password please check' });
          }
        });
      } else {
        res.status(400).send({ data: "user doesn't exist " });
      }
    }
  );
});

router.get('/verify', authenticate, (req, res) => {
  if (req.user) {
    res.send({ loggedIn: true, user: req.user });
  } else {
    res.send({ loggedIn: false });
  }
});

router.get('/admin', authenticate, (req, res) => {
  if (req.user.role === 'admin') {
    res.status(200).json({ data: true, user: req.user.role });
  } else {
    res.status(403).json({ data: false });
  }
});

router.get('/logout', function (req, res) {
  // if (req.session) {
  //   // console.log(req.session);
  //   // delete session object
  //   req.session.destroy(function (err) {
  //     if (err) {
  //       return next(err);
  //     } else {
  //       return res.redirect('/');
  //     }
  //   });
  // }
});

module.exports = router;
