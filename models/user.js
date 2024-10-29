const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");

const userSchema = new mongoose.Schema({
  // Note on naming conventions: 'Username' has been utilized in the user schema and previously approved in
  // the front-end and back-end. This prevents any confusion by avoiding overlap with the 'name' property
  // in the clothingItem schema.
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect password or email."));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect password or email."));
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
