const router = require("express").Router();
const pool = require("../db");
const authenticate = require("../middleware/authorizition");

router.get("/", authenticate, async (req, res) => {
  try {
    // res.json(req.user);
    const user = await pool.query("SELECT role FROM users WHERE id = $1", [
      req.user,
    ]);
    if (req.user.role === "admin") return res.json(user.rows[0]);
    else {
      return res.status(403).json({ message: { msg: "you not an admin" } });
    }
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
