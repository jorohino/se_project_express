const router = require("express").Router();

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const NotFoundError = require("../errors/NotFoundError");
const {
  validateNewUser,
  validateExistingUser,
} = require("../middlewares/validation");

router.post("/signin", login, validateExistingUser);
router.post("/signup", createUser, validateNewUser);

router.use("/users", userRouter);

router.use("/items", itemRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
