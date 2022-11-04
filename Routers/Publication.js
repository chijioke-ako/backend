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

router.get("/", async (req, res) => {
  try {
    const allPublications = await pool.query("SELECT * FROM  publications ");
    res.json(allPublications.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get all publications
router.get("/:id", async (req, res) => {
  try {
    const results = await pool.query(
      "SELECT * FROM publications WHERE id = $1",
      [req.params.id]
    );
    res.status(200).json({
      status: " Successfully !",
      data: {
        publications: results.rows[0],
      },
    });
  } catch (err) {
    console.error(err.message);
  }
});

//post Publications

router.post("/", upload.single("feature_image"), (req, res) => {
  feature_image = req.file.path;
  const { title, sub_title, author, feature_image_caption, body } = req.body;

  pool.query(
    "INSERT INTO publications (  title, sub_title, author, feature_image, feature_image_caption, body ) VALUES (  $1, $2, $3, $4, $5, $6 ) RETURNING *",
    [title, sub_title, author, feature_image, feature_image_caption, body],

    (err, results) => {
      if (!title || !author || !feature_image_caption) {
        return res.status(400).json({ msg: "Please fill all fields" });
      } else {
        res.status(201).json({
          status: "Publications Submit Successfully !",
          data: {
            publications: results.rows[0],
          },
        });
      }
    }
  );
});

//put Publications
router.put("/:id", upload.single("feature_image"), async (req, res) => {
  try {
    feature_image = req.file.path;
    const { id } = req.params;

    const { title, sub_title, author, feature_image_caption, body } = req.body;

    const results = await pool.query(
      "UPDATE publications SET title=($1), sub_title=($2), author=($3), feature_image_caption=($4), body=($5), feature_image=($6) WHERE id=($7) returning *",
      [title, sub_title, author, feature_image_caption, body, feature_image, id]
    );

    res.status(200).json({
      status: "publications was updated Successfully !",
      data: {
        publications: results.rows[0],
      },
    });
  } catch (err) {
    console.error(err.message);
  }
});

//delete Publications
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletePublications = await pool.query(
      "DELETE FROM publications WHERE id= $1",
      [id]
    );
    res.json("publications was deleted Successfully !");
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
