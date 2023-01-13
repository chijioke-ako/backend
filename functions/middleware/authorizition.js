const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  if (!req.headers["authorization"]) return res.send("Unauthorized");
  const authHeader = req.headers["authorization"];

  const bearerToken = authHeader.split(" ");

  const token = bearerToken[1];

  jwt.verify(token, process.env.JWTSECRET, (err, payload) => {
    if (err) {
      return res.status(401).send("Unauthorized");
    }
    req.user = payload;

    // console.log(req.user);
    next();
  });
};
