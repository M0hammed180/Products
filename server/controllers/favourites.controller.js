const Favourites = require("../models/favouritesSchema");
const asyncWrapper = require("../middleware/asyncWrapper");
const Event = require("../models/eventSchema");

const addtoFavourites = asyncWrapper(async (req, res) => {
  const { productId, userId } = req.body;

  const favouritesExist = await Favourites.findOne({ userId });

  if (favouritesExist) {
    await Favourites.findByIdAndUpdate(favouritesExist._id, {
      $push: { products: productId },
    });
  } else {
    await Favourites.create({
      userId,
      products: [productId],
    });
  }

  const existingEvent = await Event.findOne({
    userId,
    productId,
    type: "wishlist",
  });

  if (!existingEvent) {
    await Event.create({
      userId,
      productId,
      type: "wishlist",
    });
  }

  res.status(201).json({
    success: true,
    message: "Product Added Successefully",
  });
});

const showFavourites = asyncWrapper(async (req, res) => {
  const { userId } = req.params;

  const favouritesExist = await Favourites.findOne({ userId });
  let myFavourites = [];
  let message = "";

  if (favouritesExist) {
    myFavourites = favouritesExist;
    message = "favourites";
  } else {
    message = "no favourites";
  }

  res.status(201).json({
    success: true,
    message,
    myFavourites,
  });
});

const showFavouriteswithPro = asyncWrapper(async (req, res) => {
  const { userId } = req.params;

  const favouritesExist = await Favourites.findOne({ userId }).populate(
    "products",
  );
  let myFavourites = [];
  let message = "";

  if (favouritesExist) {
    myFavourites = favouritesExist;
    message = "favourites";
  } else {
    message = "no favourites";
  }

  res.status(201).json({
    success: true,
    message,
    myFavourites,
  });
});

const removeProductFromFavourites = asyncWrapper(async (req, res) => {
  const { productId, userId } = req.body;

  const favourites = await Favourites.findOneAndUpdate(
    { userId },
    { $pull: { products: productId } },
    { new: true },
  );

  res.status(200).json({
    success: true,
    message: "Product removed successfully",
    data: favourites,
  });
});

module.exports = {
  addtoFavourites,
  showFavourites,
  removeProductFromFavourites,
  showFavouriteswithPro,
};
