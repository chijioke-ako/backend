const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const pool = require("./db");

const Mail = require("./Routers/Mail");

const PORT = process.env.PORT || 5000;

const app = express();

//Allow origin Access origin and method
app.use(cors({ origin: true, credentials: true, optionsSuccessStatus: 200 }));

// app.use(
//   session({
//     key: "userId",
//     secret: "keyboard cat",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {  expires: 60 * 60 * 24 }
//   })
app.use(
  session({
    key: "userId",
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

app.use(express.json());
app.use(morgan("dev"));
// parse application/json
app.use(bodyParser.json({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

app.use(function (err, res, req, next) {
  res.status(err.status).send(err);
});

app.get("/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM test");
    const results = { results: result ? result.rows : null };
    res.json(results);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get("/", async (req, res) => {
  res.send("hello world !");
});

app.use("/partners", require("./Routers/Partnerts"));
app.use("/publications", require("./Routers/Publication"));
app.use("/lastPublications", require("./Routers/pub"));
app.use("/archives", require("./Routers/Archment"));
app.use("/resumes", require("./Routers/resume"));
app.use("/api", Mail);
app.use("/mail", require("./Routers/mailContact"));
app.use("/contact", require("./Routers/Contact"));
app.use("/pcms", require("./Routers/Pcms"));
app.use("/openbravo", require("./Routers/Openbravo"));
app.use("/download", require("./Routers/download"));
app.use("/auth", require("./Routers/jwtAuth"));
app.use("/dashboard", require("./Routers/Dashbroad"));
app.use("/admin", require("./Routers/Admin"));
app.use("/users", require("./Routers/users"));

app.listen(PORT, () => {
  console.log(`Server is started ${PORT}`);
});
