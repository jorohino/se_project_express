const router = require("express").Router();

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const { NOT_FOUND } = require("../utils/errors");
const auth = require("../middlewares/auth");

router.use("/users", userRouter);

router.use("/items", auth, itemRouter);

router.post("/signin", login);
router.post("/signup", createUser);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
