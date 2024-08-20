const router = require("express").Router();
const { getUsers, createUser } = require("../controllers/users");

// Return all users
router.get("/", getUsers);
// Return user by _id
router.get("/:userId", () => console.log("GET users by _id"));
// Create a new user
router.post("/", createUser);

module.exports = router;
