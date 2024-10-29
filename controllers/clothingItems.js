const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");

// Return all clothing items
const getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(next);
};

// Create new clothing item
const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return next(new BadRequestError("Invalid data."));
      }
      if (error.name === "CastError") {
        return next(new BadRequestError("Invalid data."));
      }
      return next(error);
    });
};

// Delete clothing item by _id
const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        return next(new ForbiddenError("Forbidden: You do not have access."));
      }
      return ClothingItem.findByIdAndDelete(itemId).then((item) =>
        res.send(item)
      );
    })
    .catch((err) => {
      if (err.name === ForbiddenError) {
        return next(new ForbiddenError("Forbidden: You do not have access."));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Document not found."));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data."));
      }
      return next(error);
    });
};

// Like clothing item by _id
const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Document not found."));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data."));
      }
      return next(error);
    });
};

// Dislike clothing item by _id
const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Document not found."));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data."));
      }
      return next(error);
    });
};

module.exports = {
  createClothingItem,
  getClothingItems,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
