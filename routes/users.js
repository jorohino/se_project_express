const router = require("express").Router();
const { getCurrentUser, getUsers, getUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

// Return all users
router.get("/", auth, getUsers);

// Return user by _id
router.get("/:userId", auth, getUser);

// Return current user by _id
router.get("/me", auth, getCurrentUser);

module.exports = router;
