const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");

// Create a new user
const createUser = (req, res, next) => {
  const { username, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return next(new ConflictError("Email already in use."));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ username, avatar, email, password: hash }))
    .then((user) =>
      res.status(201).send({
        username: user.username,
        avatar: user.avatar,
        email: user.email,
      })
    )
    .catch((error) => {
      if (error.name === "ConflictError") {
        return next(new ConflictError("Email already in use."));
      }
      if (error.name === "ValidationError") {
        return next(new BadRequestError("Invalid data."));
      }
      return next(error);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found."));
      }
      return res.send(user);
    })
    .catch((error) => next(error));
};

const updateUser = (req, res, next) => {
  const { username, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { username, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return next(new NotFoundError("User not found."));
      }
      return res.send(updatedUser);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return next(new BadRequestError("Invalid data."));
      }
      return next(error);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required."));
  }

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
    .catch((error) => {
      if (error.message === "Incorrect password or email.") {
        return next(new UnauthorizedError("Incorrect password or email."));
      }
      return next(error);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
