const router = require("express").Router();
const { getClothingItems } = require("../controllers/clothingItems");

// Return all clothing items
router.get("/", getClothingItems);
// Create a new clothing item
router.post("/", () => console.log("CREATE item"));
// Create a new user
router.delete("/:itemId", () => console.log("DELETE item by _id"));

module.exports = router;
