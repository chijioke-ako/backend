const express = require("express");
const pool = require("./db");

const PORT = process.env.PORT || 5000;

const app = express();

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
