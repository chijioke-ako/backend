const router = require('express').Router();
const pool = require('../db');
require('dotenv').config();

const authenticate = require('../middleware/authorizition');

router.get(
  '/',
  // authenticate,

  async (req, res) => {
    try {
      const allUsers = await pool.query('SELECT * FROM users');
      res.json(allUsers.rows);
    } catch (err) {
      console.error(err.message);
    }
  }
);

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const Partners = await pool.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    res.json(Partners.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { firstname, lastname, email, role } = req.body;
    const updateUsers = await pool.query(
      'UPDATE users SET firstname=($1), lastname =($2), email=($3),  role =($4) WHERE id=($5) RETURNING *',
      [firstname, lastname, email, role, id]
    );
    res.json('users was updated Successfully !');
  } catch (err) {
    console.error(err.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteusers = await pool.query('DELETE FROM users WHERE id= $1', [
      id,
    ]);
    res.json('Users was deleted Successfully !');
  } catch (err) {
    console.error(err.message);
  }
});
module.exports = router;
