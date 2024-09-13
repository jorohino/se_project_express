const router = require("express").Router();
const {
  getCurrentUser,
  getUsers,
  getUser,
  updateUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

// Return current user by _id
router.get("/me", auth, getCurrentUser);

// Return all users
router.get("/", auth, getUsers);

// Return user by _id
router.get("/:userId", auth, getUser);

// Update user name and avatar
router.patch("/me", auth, updateUser);

module.exports = router;
