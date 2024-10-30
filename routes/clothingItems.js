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
router.post("/", auth, validateNewItem, createClothingItem);

// Delete a clothing item by _id
router.delete("/:itemId", auth, validateId, deleteClothingItem);

// Like item by _id
router.put("/:itemId/likes", auth, validateId, likeItem);

// Dislike item by _id
router.delete("/:itemId/likes", auth, validateId, dislikeItem);

module.exports = router;
