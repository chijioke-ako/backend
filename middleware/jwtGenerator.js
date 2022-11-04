const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id) {
  const payload = {
    user: user_id,
    role: user_id,
  };

  const secret = process.env.JWTSECRET;

  const options = {
    expiresIn: "1h",
    issuer: "chijioke.com",
  };

  return jwt.sign(payload, secret, options);
}

module.exports = jwtGenerator;
