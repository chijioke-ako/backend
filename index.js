const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const pool = require("./db");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(morgan("dev"));
// parse application/json
app.use(bodyParser.json({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

app.use(function (err, res, req, next) {
  res.status(err.status).send(err);
});

// app.get("/api", async (req, res) => {
//   pool.query("SELECT * FROM test_t", (err, result) => {
//     if (err) throw err;
//     res.send(result.rows[0]);
//   });
// });

app.get("/", async (req, res) => {
  res.send("hello world !");
});

app.listen(PORT, () => {
  console.log(`Server is started ${PORT}`);
});
