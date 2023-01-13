const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id, roles) {
  const payload = {
    user: user_id,
    role: roles,
  };

  const secret = process.env.JWTSECRET;

  const options = {
    expiresIn: "1h",
    issuer: "chijioke.com",
  };

  return jwt.sign(payload, secret, options);
}

module.exports = jwtGenerator;
