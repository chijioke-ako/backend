const router = require('express').Router();
const pool = require('../db');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload');
  },
  filename: function (req, file, cb) {
    cb(null, 'pdf');
    // cb(
    //   null,
    //   new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
    // );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jfif' ||
    file.mimetype === 'image/PNG' ||
    file.mimetype === 'application/pdf'
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

//get resume
router.get('/', async (req, res) => {
  try {
    const allResume = await pool.query('SELECT * FROM resume');
    res.json(allResume.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get all resume
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const Parterts = await pool.query('SELECT * FROM resume WHERE id = $1', [
      id,
    ]);
    res.json(Parterts.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

router.post('/', upload.single('resume'), (req, res) => {
  resume = req.file.path;
  const { surname, firstname, email, coverletter } = req.body;

  pool.query(
    'INSERT INTO resume ( surname, firstname, email,  coverletter, resume ) VALUES ( $1, $2, $3, $4, $5 ) RETURNING *',
    [surname, firstname, email, coverletter, resume],

    (err, results) => {
      if (!surname || !firstname || !email || !coverletter) {
        return res.status(400).json({ msg: 'Please fill all fields' });
      } else {
        res.status(201).json({
          status: 'Resume  Submit Successfully !',
          data: {
            resumes: results.rows[0],
          },
        });
      }
    }
  );
});

//put Resume
router.put('/:id', upload.single('resume'), async (req, res) => {
  try {
    const { id } = req.params;
    resume = req.file.buffer.toString('base64');
    const { surname, firstname, coverletter, email } = req.body;
    const updateResume = await pool.query(
      'UPDATE resume SET surname=($1), resume=($2), firstname =($3), coverletter=($4), email =($5) WHERE resume_id=($6)',
      [surname, resume, firstname, coverletter, email, id]
    );
    res.json('Resume was updated Successfully !');
  } catch (err) {
    console.error(err.message);
  }
});

//delete Resume
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteResume = await pool.query('DELETE FROM resume WHERE id= $1', [
      id,
    ]);
    res.json('resume was deleted Successfully !');
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
