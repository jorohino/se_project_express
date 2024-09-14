const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

// Return current user by _id
router.get("/me", auth, getCurrentUser);

// Update user name and avatar
router.patch("/me", auth, updateUser);

module.exports = router;
