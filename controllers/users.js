const User = require("../models/user");
const {
  DEFAULT,
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");

// Return all users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server." });
    });
};

// Create a new user
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(CONFLICT).send({ message: "Email already in use." });
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      if (!hash) return;

      return User.create({ name, avatar, email, password: hash });
    })
    .then((user) => {
      if (user) {
        res.status(201).send(user);
      }
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

// Get a user by _id
const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found." });
      }
      if (err.name === "CastError") {
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
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server." });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(NOT_FOUND).send({ message: "User not found." });
      }
      res.send(updatedUser);
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
  const jwt = require("jsonwebtoken");
  const { email, password } = req.body;

  console.log("Login attempt with email:", email);

  User.findUserByCredentials(email, password)
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
      res
        .status(UNAUTHORIZED)
        .send({ message: "Incorrect password or email." });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  login,
  getCurrentUser,
  updateUser,
};
