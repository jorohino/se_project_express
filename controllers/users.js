const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  DEFAULT,
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// Create a new user
const createUser = (req, res) => {
  const { username, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        const error = new Error("Email already in use.");
        error.statusCode = CONFLICT;
        throw error;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      if (!hash) {
        return res
          .status(DEFAULT)
          .send({ message: "Password hashing failed." });
      }

      return User.create({ username, avatar, email, password: hash });
    })
    .then((user) =>
      res.status(201).send({
        username: user.username,
        avatar: user.avatar,
        email: user.email,
      })
    )
    .catch((err) => {
      console.error(err);

      if (err.statusCode === CONFLICT) {
        return res.status(CONFLICT).send({ message: "Email already in use." });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data." });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server." });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found." });
      }
      return res.send(user);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server." });
    });
};

const updateUser = (req, res) => {
  const { username, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { username, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(NOT_FOUND).send({ message: "User not found." });
      }
      return res.send(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data." });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server." });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required." });
  }

  console.log("Login attempt with email:", email);

  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log("User authenticated:", user);
      res.send({
        token: jwt.sign(
          {
            _id: user._id,
          },
          JWT_SECRET,
          {
            expiresIn: "7d",
          }
        ),
      });
    })
    .catch((err) => {
      console.error("Login error:", err.message);
      if (err.message === "Incorrect password or email.") {
        return res
          .status(UNAUTHORIZED)
          .send({ message: "Incorrect password or email." });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
