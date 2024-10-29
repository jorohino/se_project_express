const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateUpdateUser } = require("../middlewares/validation");

// Return current user by _id
router.get("/me", auth, getCurrentUser);

// Update user name and avatar
router.patch("/me", auth, updateUser, validateUpdateUser);

module.exports = router;
