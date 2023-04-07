const router = require("express").Router();
const pool = require("../db");

//post openbravo
router.post("/", async (req, res) => {
  const { name, company, telephone, email } = req.body;

  pool.query(
    "INSERT INTO openbravo (name , company,telephone,email) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, company, telephone, email],

    (err, results) => {
      if (!name || !telephone || !email) {
        return res.status(400).json({ msg: "Please fill all fields" });
      } else {
        res.status(201).json({
          status: "openbravo Submit Successfully !",
          data: {
            pcms: results.rows[0],
          },
        });
      }
    }
  );
});

module.exports = router;
