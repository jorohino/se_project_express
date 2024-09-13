const router = require("express").Router();
const { getCurrentUser, getUsers, getUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

// Return current user by _id
router.get("/me", auth, getCurrentUser);

// Return all users
router.get("/", auth, getUsers);

// Return user by _id
router.get("/:userId", auth, getUser);

module.exports = router;
