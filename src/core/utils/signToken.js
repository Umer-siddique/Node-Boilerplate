const jsonwebtoken = require("jsonwebtoken");
const { jwt } = require("../../config/env/develoment");

const signToken = (id) => {
  return jsonwebtoken.sign({ id }, jwt.secret, {
    expiresIn: jwt.expiresIn,
  });
};

module.exports = signToken;
