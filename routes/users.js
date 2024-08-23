const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");

// Return all users
router.get("/", getUsers);

// Return user by _id
router.get("/:userId", getUser);

// Create a new user
router.post("/", createUser);

module.exports = router;
