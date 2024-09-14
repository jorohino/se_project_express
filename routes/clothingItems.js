const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

// Return all clothing items
router.get("/", getClothingItems);

// Create a new clothing item
router.post("/", auth, createClothingItem);

// Delete a clothing item by _id
router.delete("/:itemId", auth, deleteClothingItem);

// Like item by _id
router.put("/:itemId/likes", auth, likeItem);

// Dislike item by _id
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
