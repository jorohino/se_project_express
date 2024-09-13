const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");

const auth = (req, res, next) => {
  console.log("auth middleware triggered for ", req.path);

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Authorization required." });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Authorization required." });
  }

  req.user = payload;

  return next();
};

module.exports = auth;
