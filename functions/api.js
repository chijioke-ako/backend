const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const pool = require('../db');

const Mail = require('./Routers/Mail');
const app = express();
const router = express.Router();
//Allow origin Access origin and method
app.use(cors({ origin: true, credentials: true, optionsSuccessStatus: 200 }));
app.set('trust proxy', 1);

app.use(express.json());
app.use(morgan('dev'));
// parse application/json
app.use(bodyParser.json({ extended: true }));
// app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static('uploads'));

// router.get('/db', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM test');
//     const results = { results: result ? result.rows : null };
//     res.json(results);
//   } catch (err) {
//     console.error(err);
//     res.send('Error ' + err);
//   }
// });

router.get('/', async (req, res) => {
  res.send('hello world !');
});

app.use('/', router);

app.use('/partners', require('./Routers/Partnerts'));
app.use('/publications', require('./Routers/Publication'));
app.use('/lastPublications', require('./Routers/pub'));
app.use('/archives', require('./Routers/Archment'));
app.use('/resumes', require('./Routers/resume'));
app.use('/api', Mail);
app.use('/mail', require('./Routers/mailContact'));
app.use('/contact', require('./Routers/Contact'));
app.use('/pcms', require('./Routers/Pcms'));
app.use('/openbravo', require('./Routers/Openbravo'));
app.use('/download', require('./Routers/download'));
app.use('/auth', require('./Routers/jwtAuth'));
app.use('/dashboard', require('./Routers/Dashbroad'));
app.use('/users', require('./Routers/users'));
app.use('/restPassword', require('./Routers/Forgot_password'));

module.exports.handler = serverless(app);
