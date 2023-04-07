const router = require("express").Router();
const pool = require("../db");
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
    file.mimetype === "image/PNG"
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

//LIMIT 5 OFFSET 1

// //get Partners
router.get("/", async (req, res) => {
  try {
    const allPartners = await pool.query("SELECT *  FROM  partners LIMIT 5  ");
    res.json(allPartners.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get all Partners
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const Partners = await pool.query("SELECT * FROM partners WHERE id = $1", [
      id,
    ]);
    res.json(Partners.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//post Partners
router.post("/", upload.single("logo"), async (req, res) => {
  logo = req.file.path;
  const { name, profile, url } = req.body;

  pool.query(
    "INSERT INTO partners (name , profile, logo, url) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, profile, logo, url],

    (err, results) => {
      if (!name || !profile || !url) {
        return res.status(400).json({ msg: "Please fill all fields" });
      } else {
        res.status(201).json({
          status: "Partners Submit Successfully ! ",
          data: {
            partners: results.rows[0],
          },
        });
        // console.log(results.rows);
      }
    }
  );
});

//put partner's
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    logo = req.file.buffer.toString("base64");
    const { name, profile, url } = req.body;
    const updatePartners = await pool.query(
      "UPDATE partners SET name=($1), logo=($2), profile =($3), url =($4) WHERE id=($5)",
      [name, logo, profile, url, id]
    );
    res.json("partners was updated Successfully !");
  } catch (err) {
    console.error(err.message);
  }
});

//delete Parterres
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletePartners = await pool.query(
      "DELETE FROM partners WHERE id = $1",
      [id]
    );
    res.json("partners was deleted Successfully !");
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
