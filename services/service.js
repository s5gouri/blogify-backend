require("dotenv").config();

const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
const create_token_for_user = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    name: user.name,
    profile: user.profileimg,
  };
  const token = jwt.sign(payload, secret);
  return token;
};
const validate_token = (token) => {
  const payload = jwt.verify(token, secret);
  return payload;
};
module.exports = { create_token_for_user, validate_token };
