const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtGenerator = require("../middleware/jwtGenerator");
const authenticate = require("../middleware/authorizition");

router.get("/", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteusers = await pool.query("DELETE FROM users WHERE id= $1", [
      id,
    ]);
    res.json("Users was deleted Successfully !");
  } catch (err) {
    console.error(err.message);
  }
});
module.exports = router;
