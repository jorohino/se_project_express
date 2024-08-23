const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// Return all clothing items
router.get("/", getClothingItems);

// Create a new clothing item
router.post("/", createClothingItem);

// Delete a clothing item by _id
router.delete("/:itemId", deleteClothingItem);

// Like item by _id
router.put("/:itemId/likes", likeItem);

// Dislike item by _id
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
