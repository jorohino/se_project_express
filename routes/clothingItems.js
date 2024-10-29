const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const { validateNewItem, validateId } = require("../middlewares/validation");

// Return all clothing items
router.get("/", getClothingItems);

// Create a new clothing item
router.post("/", auth, createClothingItem, validateNewItem);

// Delete a clothing item by _id
router.delete("/:itemId", auth, deleteClothingItem, validateId);

// Like item by _id
router.put("/:itemId/likes", auth, likeItem, validateId);

// Dislike item by _id
router.delete("/:itemId/likes", auth, dislikeItem, validateId);

module.exports = router;
